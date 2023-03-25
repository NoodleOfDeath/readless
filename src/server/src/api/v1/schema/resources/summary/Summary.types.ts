import {
  TITLED_CATEGORIZED_POST_ATTRS,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from '../Post.types';

export type SummaryAttributesRaw = TitledCategorizedPostAttributes & {
  outletId: number;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
};

export type SummaryAttributes = SummaryAttributesRaw & { 
  outletName: string,
};

export type SummaryCreationAttributes = TitledCategorizedPostCreationAttributes & {
  outletId: number;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
};

/** light weight record for a summary post */
export const SUMMARY_ATTRS = [...TITLED_CATEGORIZED_POST_ATTRS, 'outletId', 'url', 'originalTitle'] as const;

export type SummaryResponse = Omit<SummaryAttributes, 'rawText' | 'filteredText'>;