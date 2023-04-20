import {
  PUBLIC_TITLED_CATEGORIZED_POST_ATTRIBUTES,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from '../Post.types';
import { PublicOutletAttributes } from '../outlet/Outlet.types';
import { PublicCategoryAttributes } from '../topic/Category.types';

export type SummaryAttributesRaw = TitledCategorizedPostAttributes & {
  outletId: number;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
  originalDate?: Date;
};

export type SummaryAttributes = SummaryAttributesRaw & { 
  outletAttributes?: PublicOutletAttributes,
  categoryAttributes?: PublicCategoryAttributes,
};

export type SummaryCreationAttributes = TitledCategorizedPostCreationAttributes & {
  outletId: number;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
  originalDate?: Date;
};

/** light weight record for a summary post */
export const PUBLIC_SUMMARY_ATTRIBUTES = [...PUBLIC_TITLED_CATEGORIZED_POST_ATTRIBUTES, 'outletId', 'url', 'originalDate', 'originalTitle'] as const;
export const PUBLIC_SUMMARY_ATTRIBUTES_CONSERVATIVE = ['id', 'url', 'title', 'shortSummary', 'originalDate', 'outletId', 'category', 'createdAt'] as const;

export type PublicSummaryAttributes = Omit<SummaryAttributes, 'rawText' | 'filteredText'>;
