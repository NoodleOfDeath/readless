import { QueryTypes } from 'sequelize';
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import sharp from 'sharp';

import {
  PublicSummaryGroup,
  SummaryAttributes,
  SummaryCreationAttributes,
} from './Summary.types';
import { SummaryInteraction } from './SummaryInteraction.model';
import { SummaryMedia } from './SummaryMedia.model';
import { SummarySentiment } from './SummarySentiment.model';
import { PublicSummarySentimentAttributes } from './SummarySentiment.types';
import {
  Cache,
  QueryFactory,
  QueryKey,
  SentimentMethodName,
  Topic,
} from '../../../../../api/v1/schema';
import {
  DeepAiService,
  S3Service,
  SentimentService,
} from '../../../../../services';
import { parseDate } from '../../../../../utils';
import { BulkMetadataResponse } from '../../../controllers';
import { Post } from '../Post.model';
import { Category } from '../channel/Category.model';
import { PublicCategoryAttributes } from '../channel/Category.types';
import { Publisher } from '../channel/Publisher.model';
import { PublicPublisherAttributes } from '../channel/Publisher.types';
import { InteractionType } from '../interaction/Interaction.types';

export type SearchSummariesPayload = {
  filter?: string;
  matchType?: 'all' | 'any';
  page?: number;
  pageSize?: number;
  offset?: number;
  ids?: number[] | number;
  excludeIds?: boolean;
  interval?: string;
  locale?: string;
  start?: string;
  end?: string;
  version?: string;
  forceCache?: boolean;
  cacheLifespan?: string;
};

class Size {

  name: string;
  value: number;
  
  static xs = new Size('xs', 60);
  static sm = new Size('sm', 120);
  static md = new Size('md', 240);
  static lg = new Size('lg', 360);
  static xl = new Size('xl', 480);
  static xxl = new Size('xxl', 720);
  static xxxl = new Size('xxxl', 1920);
  
  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }
  
}

function parseTimeInterval(str: string) {
  const matches = str.match(/(\d+)\s*(months?|m(?:in(?:ute)?s?)?|h(?:(?:ou)?rs?)?|d(?:ays?)?|w(?:(?:ee)?ks?)?|y(?:(?:ea)?rs?)?)/i);
  if (matches && matches[1] && matches[2]) {
    const n = matches[1];
    const unit = matches[2];
    if (n && unit) {
      return `${n}${/month/i.test(unit) ? unit : unit[0]}`;
    }
  }
}

function buildFilter(
  filter = '',
  matchType: 'any' | 'exact' = 'exact'
) {
  const categories: string[] = [];
  const excludedCategories: string[] = [];
  const publishers: string[] = [];
  const excludedPublishers: string[] = [];
  let interval: string;
  if (!filter) {
    return {
      categories,
      excludedCategories,
      excludedPublishers,
      filter: '',
      publishers,
    };
  }
  const splitExpr = /\s*((?:[-\w]+:(?:[-\w.]*(?:,[-\w.]*)*))(?:\s+[-\w]+:(?:[-\w.]*(?:,[-\w.]*)*))*)?(.*)/i;
  const [_, prefilter, q] = splitExpr.exec(filter);
  let query = (q ?? '').trim();
  if (prefilter) {
    const expr = /(-)?(\w+):([-\w.]*(?:,[-\w.]*)*)/gi;
    const matches = prefilter.matchAll(expr);
    if (matches) {
      for (const match of matches) {
        const [_, exclude, prefix, prefixValues] = match;
        const pf = prefixValues.split(',');
        if (/^(?:source|src|pub(lisher)?)$/i.test(prefix)) {
          if (exclude) {
            excludedPublishers.push(...pf);
          } else {
            publishers.push(...pf);
          }
        }
        if (/^cat(egory)?$/i.test(prefix)) {
          if (exclude) {
            excludedCategories.push(...pf);
          } else {
            categories.push(...pf);
          }
        }
        if (/^[lp]ast$/i.test(prefix)) {
          const timeInterval = parseTimeInterval(prefixValues);
          if (timeInterval) {
            interval = timeInterval;
          }
        }
      }
    }
  }
  const parts: string[] = [];
  if (query && query.length > 0) {
    const timeMatches = query.match(/(.*?)(?:in\s+)?(?:the\s+)?[pl]ast\s+(\d+\s*(?:months?|m(?:in(?:ute)?s?)?|h(?:(?:ou)?rs?)?|d(?:ays?)?|w(?:(?:ee)?ks?)?|y(?:(?:ea)?rs?)?))/i);
    if (!interval && timeMatches && timeMatches[2]) {
      interval = parseTimeInterval(timeMatches[2]);
      if (interval) {
        query = timeMatches[1];
      }
    }
    query = query
      .replace(/\s\s+/g, ' ')
      .replace(/[-+*|=<>.^$!?(){}[\]\\]/g, ($0) => `\\${$0}`);
    if (/^\w+$/.test(query) && query.length >= 3) {
      parts.push(query);
    } else
    if (query.length < 3 || matchType === 'exact') {
      parts.push(`(?:(?:^|\\y)${query.replace(/['"]/g, ($0) => `\\${$0}`)}(?:\\y|$))`);
    } else {
      const matches = query.matchAll(/(['"])(.+?)\1|\b([\S]+)\b/gm);
      if (matches) {
        const subqueries = [...matches].map((m) => (m[1] ? m[2] : m[3]).replace(/['"]/g, ($0) => `\\${$0}`));
        parts.push(...subqueries.map((subquery) => `(?:(?:^|\\y)${subquery}(?:\\y|$))`));
      }
    }
  }
  for (const category of categories) {
    parts.push(`(?:^|\\y)${category}(?:\\y|$)`);
  }
  const regex = parts.join('|');
  return {
    categories,
    excludedCategories,
    excludedPublishers,
    filter: regex.length > 2 ? regex : '',
    interval,
    publishers,
  };
}

@Table({
  modelName: 'summary',
  paranoid: true,
  timestamps: true,
})
export class Summary extends Post<SummaryAttributes, SummaryCreationAttributes> implements SummaryAttributes {
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare publisherId: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare categoryId: number;

  @Column({ type: DataType.INTEGER })
  declare subcategoryId?: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
    unique: true,
  })
  declare url: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare rawText: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare filteredText: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
  declare originalTitle: string;

  @Column({ 
    defaultValue: new Date(0),
    type: DataType.DATE,
  })
  declare originalDate: Date;

  @Column({ 
    allowNull: false,
    type: DataType.TEXT,
  })
  declare summary: string;

  @Column({
    allowNull: false, 
    type: DataType.STRING(1024), 
  })
  declare shortSummary: string;

  @Column({
    defaultValue: [],
    type: DataType.ARRAY(DataType.STRING(1024)),
  })
  declare bullets: string[];

  declare publisher: PublicPublisherAttributes;

  declare category: PublicCategoryAttributes;
  declare subcategory?: PublicCategoryAttributes;

  declare sentiment?: number;
  declare sentiments?: PublicSummarySentimentAttributes[];

  declare siblingCount?: number;
  
  public static async refreshViews(views: QueryKey | QueryKey[] = ['refresh_summary_media_view', 'refresh_summary_sentiment_view', 'refresh_summary_translation_view']) {
    for (const view of Array.isArray(views) ? views : [views]) {
      await this.sql.query(QueryFactory.getQuery(view));
    }
  }

  public static async getSitemapData() {
    const [summaries] = await this.sql.query(QueryFactory.getQuery('sitemap'));
    return summaries as Summary[];
  }

  public static async getTopStories({ interval = '1d', ...rest }: SearchSummariesPayload = {}) {
    return await this.getSummaries({ interval, ...rest }, 'top_stories');
  }
  
  public static async getSummaries({
    filter,
    forceCache,
    ids,
    excludeIds = false,
    interval: interval0,
    locale = 'en',
    start,
    end = start !== undefined ? new Date().toISOString() : undefined,
    pageSize = 10,
    page = 0,
    offset = pageSize * page,
    cacheLifespan = process.env.CACHE_lifespan || '3m',
  }: SearchSummariesPayload = {}, queryKey: QueryKey = 'search'): Promise<BulkMetadataResponse<PublicSummaryGroup, { sentiment: number }>> {
    
    const { 
      categories, 
      excludedCategories,
      excludedPublishers,
      publishers,
      interval: pastInterval,
      filter: query,
    } = buildFilter(filter, 'exact');
    
    const startDate = parseDate(start) ? parseDate(start) : end !== undefined ? new Date(0) : undefined;
    const endDate = parseDate(end) ? parseDate(end) : start !== undefined ? new Date() : undefined;
    const idArray = typeof ids === 'number' || typeof ids === 'string' ? [ids] : !ids || ids.length === 0 ? null : ids;
    const interval = (start !== undefined || end !== undefined) ? '0m' : (pastInterval ?? interval0 ?? '100y');
    
    const replacements = {
      categories: categories.length === 0 ? null : categories,
      endDate: endDate ?? new Date(0),
      excludeIds,
      excludedCategories: excludedCategories.length === 0 ? null : excludedCategories,
      excludedPublishers: excludedPublishers.length === 0 ? null : excludedPublishers,
      filter: query,
      ids: idArray,
      interval,
      limit: Number(pageSize),
      locale: locale.replace(/-[a-z]{2}$/i, '') ?? 'en',
      offset: Number(offset),
      publishers: publishers.length === 0 ? null : publishers,
      rankInterval: interval,
      startDate: startDate ?? new Date(),
    };

    const cacheKey = [
      queryKey,
      filter,
      idArray?.join(','),
      excludeIds,
      interval,
      queryKey === 'top_stories' ? '' : locale,
      start,
      end,
      pageSize,
      offset,
    ].join(':');

    if (queryKey === 'top_stories' && !forceCache) {
      const cache = await Cache.fromKey(cacheKey);
      if (cache && cache.expiresSoon === false) {
        try {
          return JSON.parse(cache.value);
        } catch (err) {
          console.error(err);
        }
      }
    }
    
    let records = ((await this.sql.query(QueryFactory.getQuery(queryKey), {
      nest: true,
      replacements,
      type: QueryTypes.SELECT,
    })) as BulkMetadataResponse<PublicSummaryGroup, { sentiment: number }>[])[0];
      
    if (!records?.rows) {
      return {
        count: 0,
        rows: [],
      };
    }
      
    // If exact search fails search partial words
    if (records.rows.length === 0) {
      const { filter: partialFilter } = buildFilter(filter, 'any');
      replacements.filter = partialFilter;
      records = ((await this.sql.query(QueryFactory.getQuery(queryKey), {
        nest: true,
        replacements,
        type: QueryTypes.SELECT,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as BulkMetadataResponse<PublicSummaryGroup, { sentiment: number }>[])[0];
    }
    
    if (filter || records.rows.length < replacements.limit) {
      return records;
    }

    await Cache.upsert({
      key: cacheKey,
      lifespan: cacheLifespan,
      value: JSON.stringify(records),
    });
    
    return records;
  }

  async getInteractions(userId?: number, type?: InteractionType | InteractionType[]) {
    if (userId && type) {
      return await SummaryInteraction.findAll({
        where: {
          targetId: this.id, type, userId, 
        },
      });
    } else if (userId) {
      return await SummaryInteraction.findAll({ where: { targetId: this.id, userId } });
    }
    return await SummaryInteraction.findAll({ where: { targetId: this.id } });
  }
  
  async getSentiments() {
    return await SummarySentiment.findAll({ where: { parentId: this.id } });
  }
  
  async getPublisher() {
    return await Publisher.findByPk(this.publisherId);
  }
  
  async getCategory() {
    return await Category.findByPk(this.categoryId);
  }
  
  async getTopic() {
    return await Topic.topicOfChild(this);
  }

  async getSiblings() {
    return (await (await this.getTopic())?.getChildren() ?? []).filter((s) => s.id !== this.id);
  }
  
  async isRelatedTo(sibling: SummaryAttributes | number) {
    const siblingId = typeof sibling === 'number' ? sibling : sibling.id;
    const newSibling = await Summary.findByPk(siblingId);
    const topic = await this.getTopic();
    return topic && topic.id === (await newSibling.getTopic())?.id;
  }
  
  async associateWith(sibling: SummaryAttributes | number) {
    const siblingId = typeof sibling === 'number' ? sibling : sibling.id;
    const newSibling = await Summary.findByPk(siblingId);
    const topic = await this.getTopic() ?? await newSibling.getTopic() ?? await Topic.create();
    await topic.addChildren(this, newSibling);
    console.log('associated', this.id, siblingId);
  }
  
  async generateImageWithDeepAi() {
    try {
      // Generate image from the title
      const image = await DeepAiService.textToImage(this.title);
      // Save image to S3 CDN
      const obj = await DeepAiService.mirror(image.output_url, {
        ACL: 'public-read',
        ContentType: 'image/jpeg',
        Folder: 'img/s',
      });
      return obj;
    } catch (e) {
      console.error(e);
    }
  }
  
  async generateThumbnails(
    sizes = [Size.xs, Size.sm, Size.md, Size.lg],
    folder = 'img/s'
  ) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<SummaryMedia[]>(async (resolve, reject) => {
      console.log('generating thumbnails');
      const allMedia = await SummaryMedia.findAll({ where: { parentId: this.id } });
      const results: SummaryMedia[] = [];
      for (const [i, m] of allMedia.entries()) {
        console.log(`generating thumbnails for ${m.path}`);
        if (!/^img\/s/.test(m.path) || /@(?:xs|sm|md|lg|x+l)\.\w+$/.test(m.path)) {
          continue;
        }
        const file = await S3Service.getObject({ Key: m.path });
        if (!file) {
          reject('Missing file');
          return;
        }
        for (const [j, size] of sizes.entries()) {
          const subkey = `${m.key}@${size.name}`;
          const media = await SummaryMedia.findOne({
            where: {
              key: subkey,
              parentId: this.id,
            },
          });
          if (media) {
            console.log('media already exists');
            results.push(media);
            if (i + 1 === allMedia.length && j + 1 === sizes.length) {
              resolve(results);
              return;
            }
            continue;
          }
          const target = file.replace(/(\.\w+)$/, (_, $1) => `@${size.name}${$1}`);
          sharp(file)
            .resize(size.value)
            .jpeg()
            .toFile(target, async (err) => {
              if (err) {
                reject(err);
                return;
              }
              const response = await S3Service.putObject({
                ACL: 'public-read',
                Accept: 'image',
                File: target,
                Folder: folder,
              });
              const media = await SummaryMedia.create({
                key: subkey,
                parentId: this.id,
                path: response.key,
                type: 'image',
                url: response.url,
              });
              results.push(media);
              if (i + 1 === allMedia.length && j + 1 === sizes.length) {
                resolve(results);
              }
            });
        }
      }
    });
  }
  
  async generateSentiment(method: SentimentMethodName, score?: number) {
    const payload = [this.title, this.shortSummary].join('\n\n');
    if (method === 'afinn') {
      await SummarySentiment.create({
        method: 'afinn',
        parentId: this.id,
        payload,
        score: score ?? (await SentimentService.sentiment('afinn', payload))?.comparative,
      });
    } else
    if (method === 'claude-2.1') {
      await SummarySentiment.create({
        method: 'claude-2.1',
        parentId: this.id,
        payload,
        score: score ?? await SentimentService.sentiment('claude-2.1', payload),
      });
    } else
    if (method === 'gpt-3.5') {
      await SummarySentiment.create({
        method: 'gpt-3.5',
        parentId: this.id,
        payload,
        score: score ?? await SentimentService.sentiment('openai', payload),
      });
    } else
    if (method === 'vader') {
      await SummarySentiment.create({
        method: 'vader',
        parentId: this.id,
        payload,
        score: score ?? (await SentimentService.sentiment('vader', payload))?.compound,
      });
    }
  }

  async generateSentiments(...methods: SentimentMethodName[]) {
    if (methods.length === 0) {
      methods = ['afinn', 'claude-2.1', 'gpt-3.5', 'vader'];
    }
    for (const method of methods) {
      await this.generateSentiment(method);
    }
    return await SummarySentiment.findAll({ where: { parentId: this.id } });
  }

}
