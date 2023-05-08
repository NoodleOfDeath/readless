import { SummarySentimentAttributes } from './SummarySentiment.types';
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

export type SummaryAttributes = PostAttributes & {
  outletId: number;
  outlet: PublicOutletAttributes;
  // @Deprecated
  outletAttributes?: PublicOutletAttributes;
  categoryId: number;
  category: PublicCategoryAttributes;
  // @Deprecated
  categoryAttributes?: PublicCategoryAttributes;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
  originalDate?: Date;
  summary: string;
  shortSummary: string;
  bullets: string[];
  formats: ReadingFormat[];
  // @Deprecated
  summary_sentiments?: SummarySentimentAttributes[];
  sentiments: { [key: string]: SummarySentimentAttributes };
};

export type SummaryCreationAttributes = PostCreationAttributes & {
  outletId: number;
  categoryId: number;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
  originalDate?: Date;
  summary: string;
  shortSummary: string;
  bullets: string[];
};

/** light weight record for a summary post */
export const PUBLIC_SUMMARY_ATTRIBUTES = [...PUBLIC_POST_ATTRIBUTES, 'summary', 'shortSummary', 'bullets', 'outletId', 'categoryId', 'url', 'originalDate'] as const;
export const PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE = [...PUBLIC_POST_ATTRIBUTES, 'shortSummary', 'outletId', 'categoryId', 'url', 'originalDate'] as const;

export type PublicSummaryAttributes = Omit<SummaryAttributes, 'rawText' | 'filteredText'>;
