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
};

/** light weight record for a summary post */
export const PUBLIC_SUMMARY_ATTRIBUTES = [...PUBLIC_POST_ATTRIBUTES, 'summary', 'shortSummary', 'bullets', 'category', 'outletId', 'url', 'originalDate'] as const;
export const PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE = [...PUBLIC_POST_ATTRIBUTES, 'shortSummary', 'category', 'outletId', 'url', 'originalDate'] as const;

export type PublicSummaryAttributes = Omit<SummaryAttributes, 'rawText' | 'filteredText'>;
