import { PublicSummarySentimentAttributes } from './SummarySentiment.types';
import {
  PUBLIC_POST_ATTRIBUTES,
  PostAttributes,
  PostCreationAttributes,
} from '../Post.types';
import { PublicCategoryAttributes } from '../channel/Category.types';
import { PublicPublisherAttributes } from '../channel/Publisher.types';
import { Translatable } from '../localization/Translation.types';
import { Sentimental } from '../sentiment/Sentiment.types';

export const READING_FORMATS = {
  bullets: 'bullets',
  fullArticle: 'fullArticle',
  summary: 'summary',
} as const;

export type ReadingFormat = typeof READING_FORMATS[keyof typeof READING_FORMATS];

export type SummaryAttributes = PostAttributes & Sentimental & Translatable & {
  publisherId: number;
  publisher: PublicPublisherAttributes;
  // legacy support
  outletId: number;
  // legacy support
  outlet: PublicPublisherAttributes;
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
  formats?: ReadingFormat[];
  sentiments?: PublicSummarySentimentAttributes[];
};

export type SummaryCreationAttributes = PostCreationAttributes & Partial<Sentimental> & {
  publisherId: number;
  // legacy support
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
export const PUBLIC_SUMMARY_ATTRIBUTES = [...PUBLIC_POST_ATTRIBUTES, 'summary', 'shortSummary', 'bullets', 'publisherId', 'categoryId', 'subcategoryId', 'url', 'originalDate'] as const;
export const PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE = [...PUBLIC_POST_ATTRIBUTES, 'shortSummary', 'publisherId', 'categoryId', 'subcategoryId', 'url', 'originalDate'] as const;

export type PublicSummaryAttributes = Omit<SummaryAttributes, 'rawText' | 'filteredText' | 'originalTitle'>;

export type PublicSummaryGroup = Omit<PublicSummaryAttributes, 'shortSummary' | 'summary' | 'bullets' | 'sentiments'> & {
  shortSummary?: string;
  summary?: string;
  bullets?: string[];
  sentiments?: PublicSummarySentimentAttributes[];
  siblings?: PublicSummaryGroup[];
};