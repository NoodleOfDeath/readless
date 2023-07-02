import { Op, QueryTypes } from 'sequelize';
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { SummaryAttributes, SummaryCreationAttributes } from './Summary.types';
import { SummaryInteraction } from './SummaryInteraction.model';
import { SummaryRelation } from './SummaryRelation.model';
import { SummarySentiment } from './SummarySentiment.model';
import { PublicSummarySentimentAttributes } from './SummarySentiment.types';
import { GET_TOPICS, SEARCH_SUMMARIES } from './queries';
import { parseDate } from '../../../../../utils';
import { Cache } from '../../system/Cache.model';
import { Post } from '../Post.model';
import { Category } from '../channel/Category.model';
import { PublicCategoryAttributes } from '../channel/Category.types';
import { Outlet } from '../channel/Outlet.model';
import { PublicOutletAttributes } from '../channel/Outlet.types';
import { InteractionType } from '../interaction/Interaction.types';
import { PublicTranslationAttributes } from '../localization/Translation.types';

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
  forceCache?: boolean;
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
  const outlets: string[] = [];
  let interval: string;
  if (!filter) {
    return {
      categories,
      filter: '.',
      outlets,
    };
  }
  const splitExpr = /\s*((?:\w+:(?:[-\w.]*(?:,[-\w.]*)*))(?:\s+\w+:(?:[-\w.]*(?:,[-\w.]*)*))*)?(.*)/i;
  const [_, prefilter, q] = splitExpr.exec(filter);
  let query = (q ?? '').trim();
  if (prefilter) {
    const expr = /(\w+):([-\w.]*(?:,[-\w.]*)*)/gi;
    const matches = prefilter.matchAll(expr);
    if (matches) {
      for (const match of matches) {
        const [_, prefix, prefixValues] = match;
        const pf = prefixValues.split(',');
        if (/^cat(egory)?$/i.test(prefix)) {
          categories.push(...pf);
        }
        if (/^(?:outlet|source|src)$/i.test(prefix)) {
          outlets.push(...pf);
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
      const subqueries = [...matches].map((match) => ({
        boundaries: Boolean(match[1]),
        value: (match[1] ? match[2] : match[3]).replace(/['"]/g, ($0) => `\\${$0}`),
      }));
      if (matchType === 'all') {
        //
      } else {
        parts.push(...subqueries.map((subquery) => subquery.boundaries ? `(?:(?:^|\\y)${subquery.value}(?:\\y|$))` : `(?:${subquery.value})`));
      }
    }
  }
  return {
    categories,
    filter: parts.join('|'),
    interval,
    outlets,
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
  declare outletId: number;
  
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

  declare outlet: PublicOutletAttributes;
  declare category: PublicCategoryAttributes;
  declare subcategory?: PublicCategoryAttributes;

  declare sentiment?: number;
  declare sentiments?: PublicSummarySentimentAttributes[];

  declare translations?: PublicTranslationAttributes[];
  
  public static async getTopics({
    filter,
    ids,
    excludeIds = false,
    matchType,
    interval,
    locale,
    start,
    end = start !== undefined ? new Date().toISOString() : undefined,
    pageSize = 10,
    page = 0,
    offset = pageSize * page,
    forceCache = false,
  }: SearchSummariesPayload) {
    const { 
      categories, 
      outlets,
      interval: pastInterval,
      filter: query,
    } = applyFilter(filter, matchType);
    const startDate = parseDate(start) ? parseDate(start) : end !== undefined ? new Date(0) : undefined;
    const endDate = parseDate(end) ? parseDate(end) : start !== undefined ? new Date() : undefined;
    const idArray = typeof ids === 'number' ? [ids] : !ids || ids.length === 0 ? [-1] : ids;
    const replacements = {
      categories: categories.length === 0 ? [''] : categories,
      endDate: endDate ?? new Date(0),
      excludeIds,
      filter: query,
      ids: idArray,
      interval: (start !== undefined || end !== undefined) ? '0m' : (pastInterval ?? interval ?? '100y'),
      limit: Number(pageSize),
      locale: locale?.replace(/-[a-z]{2}$/i, '') ?? '',
      noCategories: categories.length === 0,
      noFilter: !filter,
      noIds: !ids || excludeIds,
      noOutlets: outlets.length === 0,
      offset: Number(offset),
      outlets: outlets.length === 0 ? [''] : outlets,
      startDate: startDate ?? new Date(),
    };
    const cacheKey = [
      'getTopics',
      filter,
      idArray?.join(','),
      excludeIds,
      matchType,
      interval,
      locale,
      start,
      end,
      pageSize,
      page,
    ].join(':');
    if (!forceCache) {
      const cache = await Cache.fromKey(cacheKey);
      if (cache && cache.expiresSoon === false) {
        try {
          return JSON.parse(cache.value);
        } catch (err) {
          console.error(err);
        }
      }
    }
    
    const fetch = async () => {
      
      const records = (await this.store.query(GET_TOPICS, {
        nest: true,
        replacements,
        type: QueryTypes.SELECT,
      })) as any[];
      
      if (records.length < replacements.limit) {
        return records;
      }
      
      const filteredRecords = records.reverse().filter((a, i) => {
        return ![...records].slice(i).some((b) => b.siblings.some((s) => s.id === a.id));
      }).reverse();
      
      if (filteredRecords.length < replacements.limit) {
        replacements.offset += replacements.limit;
        replacements.limit -= filteredRecords.length;
        return [...filteredRecords, ...(await fetch())];
      }
    
      return filteredRecords;
    };
    
    const filteredRecords = await fetch();
    
    const response = {
      count: filteredRecords.length,
      rows: filteredRecords,
    };
    
    await Cache.upsert({
      halflife: process.env.CACHE_HALFLIFE || '2m',
      key: cacheKey,
      value: JSON.stringify(response),
    });
    return response;
  }
  
  public static async searchSummaries({
    filter,
    ids,
    excludeIds = false,
    matchType,
    interval,
    locale,
    start,
    end = start !== undefined ? new Date().toISOString() : undefined,
    pageSize = 10,
    page = 0,
    offset = pageSize * page,
    forceCache = false,
  }: SearchSummariesPayload) {
    const { 
      categories, 
      outlets,
      interval: pastInterval,
      filter: query,
    } = applyFilter(filter, matchType);
    const startDate = parseDate(start) ? parseDate(start) : end !== undefined ? new Date(0) : undefined;
    const endDate = parseDate(end) ? parseDate(end) : start !== undefined ? new Date() : undefined;
    const idArray = typeof ids === 'number' ? [ids] : !ids || ids.length === 0 ? [-1] : ids;
    const replacements = {
      categories: categories.length === 0 ? [''] : categories,
      endDate: endDate ?? new Date(0),
      excludeIds,
      filter: query,
      ids: idArray,
      interval: (start !== undefined || end !== undefined) ? '0m' : (pastInterval ?? interval ?? '100y'),
      limit: Number(pageSize),
      locale: locale?.replace(/-[a-z]{2}$/i, '') ?? '',
      noCategories: categories.length === 0,
      noFilter: !filter,
      noIds: !ids || excludeIds,
      noOutlets: outlets.length === 0,
      offset: Number(offset),
      outlets: outlets.length === 0 ? [''] : outlets,
      startDate: startDate ?? new Date(),
    };
    const cacheKey = [
      'getSummaries',
      filter,
      idArray?.join(','),
      excludeIds,
      matchType,
      interval,
      locale,
      start,
      end,
      pageSize,
      page,
    ].join(':');
    if (!forceCache) {
      const cache = await Cache.fromKey(cacheKey);
      if (cache && cache.expiresSoon === false) {
        try {
          return JSON.parse(cache.value);
        } catch (err) {
          console.error(err);
        }
      }
    }
    const records = (await this.store.query(SEARCH_SUMMARIES, {
      nest: true,
      replacements,
      type: QueryTypes.SELECT,
    }))?.[0] ?? { count: 0, rows: [] };
    await Cache.upsert({
      halflife: process.env.CACHE_HALFLIFE || '2m',
      key: cacheKey,
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
  
  async getOutlet() {
    return await Outlet.findByPk(this.outletId);
  }
  
  async getCategory() {
    return await Category.findByPk(this.categoryId);
  }
  
  async getSiblings<
    Deep extends boolean = false,
    R extends Deep extends true ? Summary[] : number[] = Deep extends true ? Summary[] : number[]
  >(deep?: Deep): Promise<R> {
    const siblings = (await SummaryRelation.findAll({ where: { parentId: this.id } })).map((r) => r.siblingId);
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
  
  async associateWith(sibling: number | SummaryAttributes, recurse = true) {
    const id = typeof sibling === 'number' ? sibling : sibling.id;
    if (recurse) {
      const relations = await SummaryRelation.findAll({
        where: { 
          [Op.or]: [
            { parentId: [this.id, id] },
          ],
        },
      });
      for (const relation of relations) {
        if (relation.siblingId === this.id || relation.siblingId === id) {
          continue;
        }
        const siblingSummary = await Summary.scope('public').findByPk(relation.siblingId);
        await siblingSummary.associateWith(id, false);
        await siblingSummary.associateWith(this.id, false);
      }
    }
    await SummaryRelation.findOrCreate({
      where: {
        parentId: this.id,
        siblingId: id,
      },
    });
    await SummaryRelation.findOrCreate({
      where: {
        parentId: id,
        siblingId: this.id,
      },
    });
  }

}
