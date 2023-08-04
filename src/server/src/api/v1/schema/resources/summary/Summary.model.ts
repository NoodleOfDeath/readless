import { Op, QueryTypes } from 'sequelize';
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  PublicSummaryGroup,
  SummaryAttributes,
  SummaryCreationAttributes,
} from './Summary.types';
import { SummaryInteraction } from './SummaryInteraction.model';
import { SummaryRelation } from './SummaryRelation.model';
import { SummarySentiment } from './SummarySentiment.model';
import { PublicSummarySentimentAttributes } from './SummarySentiment.types';
import { SummaryTranslation } from './SummaryTranslation.model';
import { QUERIES, QueryKey } from './queries';
import { SupportedLocale } from '../../../../../core/locales';
import { DeepAiService, SentimentService } from '../../../../../services';
import { parseDate } from '../../../../../utils';
import { BulkMetadataResponse } from '../../../controllers';
import { Cache } from '../../system/Cache.model';
import { Post } from '../Post.model';
import { Category } from '../channel/Category.model';
import { PublicCategoryAttributes } from '../channel/Category.types';
import { Publisher } from '../channel/Publisher.model';
import { PublicPublisherAttributes } from '../channel/Publisher.types';
import { InteractionType } from '../interaction/Interaction.types';

export type SearchSummariesPayload = {
  filter?: string;
  matchType?: 'any' | 'all';
  page?: number;
  pageSize?: number;
  offset?: number;
  ids?: number | number[];
  excludeIds?: boolean;
  interval?: string;
  locale?: string;
  start?: string;
  end?: string;
  version?: string;
  forceCache?: boolean;
  cacheHalflife?: string;
};

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

function applyFilter(
  filter = '', 
  matchType: 'any' | 'all' = 'any'
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
          console.log(match);
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
    const matches = 
      query.replace(/\s\s+/g, ' ')
        .replace(/[-+*|=<>.^$!?(){}[\]\\]/g, ($0) => `\\${$0}`)
        .matchAll(/(['"])(.+?)\1|\b([\S]+)\b/gm);
    if (matches) {
      const subqueries = [...matches].map((match) => (match[1] ? match[2] : match[3]).replace(/['"]/g, ($0) => `\\${$0}`));
      if (matchType === 'all') {
        //
      } else {
        parts.push(...subqueries.map((subquery) => `(?:(?:^|\\y)${subquery}(?:\\y|$))`));
      }
    }
  }
  return {
    categories,
    excludedCategories,
    excludedPublishers,
    filter: parts.join('|'),
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

  public static async getSitemapData() {
    const [summaries] = await this.store.query(QUERIES.getSiteMap);
    return summaries as Summary[];
  }

  public static async getTopStories(payload: SearchSummariesPayload) {
    return await this.getSummaries(payload, 'getTopStories');
  }
  
  public static async getSummaries({
    filter,
    ids,
    excludeIds = false,
    matchType,
    interval: interval0,
    locale = 'en',
    start,
    end = start !== undefined ? new Date().toISOString() : undefined,
    pageSize = 10,
    page = 0,
    offset = pageSize * page,
    forceCache,
    cacheHalflife = process.env.CACHE_HALFLIFE || '3m',
  }: SearchSummariesPayload, queryKey: QueryKey = 'getSummaries'): Promise<BulkMetadataResponse<PublicSummaryGroup & Summary, { sentiment: number }>> {
    
    const { 
      categories, 
      excludedCategories,
      excludedPublishers,
      publishers,
      interval: pastInterval,
      filter: query,
    } = applyFilter(filter, matchType);
    
    const startDate = parseDate(start) ? parseDate(start) : end !== undefined ? new Date(0) : undefined;
    const endDate = parseDate(end) ? parseDate(end) : start !== undefined ? new Date() : undefined;
    const idArray = typeof ids === 'number' ? [ids] : !ids || ids.length === 0 ? [-1] : ids;
    const interval = (start !== undefined || end !== undefined) ? '0m' : (pastInterval ?? interval0 ?? '100y');
    
    const replacements = {
      categories: categories.length === 0 ? [''] : categories,
      endDate: endDate ?? new Date(0),
      excludeIds,
      excludedCategories: excludedCategories.length === 0 ? [''] : excludedCategories,
      excludedPublishers: excludedPublishers.length === 0 ? [''] : excludedPublishers,
      filter: query,
      ids: idArray,
      interval,
      limit: Number(pageSize),
      locale: locale.replace(/-[a-z]{2}$/i, '') ?? '',
      noCategories: categories.length === 0,
      noExcludedCategories: excludedCategories.length === 0,
      noExcludedPublishers: excludedPublishers.length === 0,
      noFilter: !filter,
      noIds: !ids || excludeIds,
      noPublishers: publishers.length === 0,
      offset: Number(offset),
      publishers: publishers.length === 0 ? [''] : publishers,
      startDate: startDate ?? new Date(),
    };
    
    const cacheKey = [
      queryKey,
      filter,
      idArray?.join(','),
      excludeIds,
      matchType,
      interval,
      queryKey === 'getTopStories' ? '' : locale,
      start,
      end,
      pageSize,
      offset,
    ].join(':');
    
    if (queryKey === 'getTopStories' && !forceCache) {
      const cache = await Cache.fromKey(cacheKey);
      if (cache && cache.expiresSoon === false) {
        try {
          return JSON.parse(cache.value);
        } catch (err) {
          console.error(err);
        }
      }
    }
    
    const siblings: PublicSummaryGroup[] = [];
    const fetch = async (previousRecords: PublicSummaryGroup[] = []) => {
      
      const records = ((await this.store.query(QUERIES[queryKey], {
        nest: true,
        replacements,
        type: QueryTypes.SELECT,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as BulkMetadataResponse<PublicSummaryGroup, { sentiment: number }>[])[0];
      
      if (!records || !records.rows) {
        return {
          count: 0,
          rows: [],
        };
      }
      
      if (filter || records.rows.length < replacements.limit) {
        return records;
      }
      
      const filteredRecords = records.rows.filter((a) => {
        const result = ![...previousRecords, ...siblings].some((r) => r.id === a.id && (!excludeIds || (excludeIds && !idArray.includes(r.id))) && !(a.publisher.name in excludedPublishers) && !(a.category.name in excludedCategories));
        if (a.siblings) {
          siblings.push(...a.siblings);
        }
        return result;
      });
      
      console.log('filtered', filteredRecords.length);
      
      if (filteredRecords.length < replacements.limit) {
        replacements.offset += replacements.limit;
        replacements.limit -= filteredRecords.length;
        return {
          count: records.count,
          metadata: records.metadata,
          rows: [...filteredRecords, ...(await fetch(filteredRecords)).rows],
        };
      }
    
      return {
        count: records.count,
        metadata: records.metadata,
        rows: filteredRecords,
      };
    };
    
    const filteredRecords = await fetch();

    if (locale !== 'en') {
      const untranslated = filteredRecords.rows.filter((r: PublicSummaryGroup) => !r.translations);
      for (const summary of untranslated.slice(0, 5)) {
        const attributes = ['title', 'shortSummary', 'summary', 'bullets'];
        const { rows } = await SummaryTranslation.translate(summary, attributes, locale as SupportedLocale);
        summary.translations = Object.fromEntries(rows.map((r) => [r.attribute, r.value]));
      }
    }
    
    const response = {
      count: filteredRecords.count,
      metadata: filteredRecords.metadata,
      next: filteredRecords.count === 0 ? 0 : replacements.offset + replacements.limit,
      rows: filteredRecords.rows,
    };
    
    await Cache.upsert({
      halflife: cacheHalflife,
      key: cacheKey,
      value: JSON.stringify(response),
    });
    
    return response;
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

  async getSiblingCount() {
    return await SummaryRelation.count({ where: { parentId: this.id } });
  }
  
  async getSiblings<
    Deep extends boolean = false,
    R extends Deep extends true ? Summary[] : number[] = Deep extends true ? Summary[] : number[]
  >(ignore: number[] = [], deep?: Deep): Promise<R> {
    const siblingIds = (await SummaryRelation.findAll({ 
      where: { 
        parentId: this.id,
        siblingId: { [Op.notIn]: [...ignore, this.id] },
      },
    })).map((r) => r.siblingId);
    let siblings = [...siblingIds];
    for (const id of siblingIds) {
      const sibling = await Summary.findByPk(id);
      siblings.push(...(await sibling.getSiblings([...ignore, ...siblingIds, this.id])));
    }
    siblings = Array.from(new Set(siblings));
    if (deep) {
      return await Promise.all(siblings.map(async (r) => await Summary.findByPk(r))) as R;
    }
    return siblings as R;
  }
  
  async dropAllSiblings() {
    await SummaryRelation.destroy({
      where: {
        [Op.or]: [
          { parentId: this.id },
          { siblingId: this.id },
        ],
      },
    });
  }
  
  async associateWith(sibling: number | SummaryAttributes, ignore: number[] = []) {
    const siblingId = typeof sibling === 'number' ? sibling : sibling.id;
    const newSibling = await Summary.findByPk(siblingId);
    const siblings = await this.getSiblings([...ignore, siblingId]);
    const stepSiblings = await newSibling.getSiblings([...ignore, this.id]);
    const relations = Array.from(new Set([...siblings, ...stepSiblings]));
    for (const relation of relations) {
      if (relation === this.id || relation === siblingId || ignore.includes(relation)) {
        continue;
      }
      const siblingSummary = await Summary.scope('public').findByPk(relation);
      await siblingSummary.associateWith(siblingId, [...ignore, ...relations, this.id]);
      await siblingSummary.associateWith(this.id, [...ignore, ...relations, siblingId]);
    }
    await SummaryRelation.findOrCreate({
      where: {
        parentId: this.id,
        siblingId,
      },
    });
    await SummaryRelation.findOrCreate({
      where: {
        parentId: siblingId,
        siblingId: this.id,
      },
    });
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
  
  async generateSentiment() {
    const openAiSentiment = await SentimentService.sentiment('openai', this.filteredText);
    await SummarySentiment.create({
      method: 'openai',
      parentId: this.id,
      score: openAiSentiment,
    });
    const afinnSentimentScores = await SentimentService.sentiment('afinn', this.filteredText);
    await SummarySentiment.create({
      method: 'afinn',
      parentId: this.id,
      score: afinnSentimentScores.comparative,
    });
    const vaderSentimentScores = await SentimentService.sentiment('vader', this.filteredText);
    await SummarySentiment.create({
      method: 'vader',
      parentId: this.id,
      score: vaderSentimentScores.compound,
    });
  }

}
