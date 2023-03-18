import { Source } from './source.model';
import { TITLED_CATEGORIZED_POST_ATTRS } from '../post.types';
import {
  Attr,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from '../post.types';

export type SourceAttributes = TitledCategorizedPostAttributes & {
  outletId: number;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
};
export type SourceWithOutletName = SourceAttributes & { outletName: string };

export type SourceCreationAttributes = TitledCategorizedPostCreationAttributes & {
  outletId: number;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
};

/** light weight record for a source post */
export const SOURCE_ATTRS = [...TITLED_CATEGORIZED_POST_ATTRS, 'outletId', 'url', 'originalTitle'] as const;

export type SourceAttr = Attr<Source, typeof SOURCE_ATTRS[number]>;
export type SourceWithOutletAttr = SourceAttr & { outletName: string };

export type ReadAndSummarizeSourcePayload = {
  url: string;
};