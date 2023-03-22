import { Source } from './Source.model';
import {
  Attr,
  TITLED_CATEGORIZED_POST_ATTRS,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from '../Post.types';

export type SourceAttributesRaw = TitledCategorizedPostAttributes & {
  outletId: number;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
};

export type SourceAttributes = SourceAttributesRaw & { 
  outletName: string,
};

export type SourceCreationAttributes = TitledCategorizedPostCreationAttributes & {
  outletId: number;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
};

/** light weight record for a source post */
export const SOURCE_ATTRS = [...TITLED_CATEGORIZED_POST_ATTRS, 'outletId', 'url', 'originalTitle'] as const;

export type SourceAttrRaw = Attr<Source, typeof SOURCE_ATTRS[number]>;
export type SourceAttr = SourceAttrRaw & { outletName: string };

export type ReadAndSummarizeSourcePayload = {
  url: string;
};