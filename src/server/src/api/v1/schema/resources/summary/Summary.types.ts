import {
  PUBLIC_POST_ATTRIBUTES,
  PostAttributes,
  PostCreationAttributes,
} from '../Post.types';
import { PublicOutletAttributes } from '../outlet/Outlet.types';
import { PublicCategoryAttributes } from '../topic/Category.types';

export const READING_FORMATS = {
  bullets: 'bullets',
  summary: 'summary',
} as const;

export type ReadingFormat = typeof READING_FORMATS[keyof typeof READING_FORMATS];

export class Sentiment {

  score: number;
  tokens: Record<string, number>;

  constructor(score: number, tokens: Record<string, number>) {
    this.score = score;
    this.tokens = tokens;
  }

  static from(str: string) {
    const expr = /\{.*\}/;
    const payload = expr.exec(str);
    if (!payload) {
      return new Sentiment(Number.NaN, {});
    }
    try {
      const { score, tokens } = JSON.parse(payload[0]);
      return new Sentiment(score, tokens);
    } catch (e) {
      return new Sentiment(Number.NaN, {});
    }
  }

}

export type SummaryAttributesRaw = PostAttributes & {
  summary: string;
  shortSummary: string;
  bullets: string[];
  category: string;
  outletId: number;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
  originalDate?: Date;
  sentiments?: Record<string, Sentiment>;
  formats: ReadingFormat[];
};

export type SummaryAttributes = SummaryAttributesRaw & { 
  outletAttributes?: PublicOutletAttributes,
  categoryAttributes?: PublicCategoryAttributes,
};

export type SummaryCreationAttributes = PostCreationAttributes & {
  summary: string;
  shortSummary: string;
  bullets: string[];
  category: string;
  outletId: number;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
  originalDate?: Date;
  sentiments?: Record<string, Sentiment>;
};

/** light weight record for a summary post */
export const PUBLIC_SUMMARY_ATTRIBUTES = [...PUBLIC_POST_ATTRIBUTES, 'summary', 'shortSummary', 'bullets', 'category', 'outletId', 'url', 'sentiments', 'originalDate'] as const;
export const PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE = [...PUBLIC_POST_ATTRIBUTES, 'shortSummary', 'category', 'outletId', 'url', 'sentiments', 'originalDate'] as const;

export type PublicSummaryAttributes = Omit<SummaryAttributes, 'rawText' | 'filteredText'>;
