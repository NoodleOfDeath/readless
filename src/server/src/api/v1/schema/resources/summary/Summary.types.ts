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
  categoryId: number;
  category: PublicCategoryAttributes;
  subcategoryId?: number;
  subcategory?: PublicCategoryAttributes;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
  originalDate?: Date;
  summary: string;
  shortSummary: string;
  bullets: string[];
  formats: ReadingFormat[];
  sentiments: SummarySentimentAttributes[];
};

export type SummaryCreationAttributes = PostCreationAttributes & {
  outletId: number;
  categoryId: number;
  subcategoryId?: number;
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
export const PUBLIC_SUMMARY_ATTRIBUTES = [...PUBLIC_POST_ATTRIBUTES, 'summary', 'shortSummary', 'bullets', 'outletId', 'categoryId', 'subcategoryId', 'url', 'originalDate'] as const;
export const PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE = [...PUBLIC_POST_ATTRIBUTES, 'shortSummary', 'outletId', 'categoryId', 'subcategoryId', 'url', 'originalDate'] as const;

export type PublicSummaryAttributes = Omit<SummaryAttributes, 'rawText' | 'filteredText'>;
