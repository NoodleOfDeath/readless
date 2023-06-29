import { PublicRecapSentimentAttributes } from './RecapSentiment.types';
import {
  PUBLIC_POST_ATTRIBUTES,
  PostAttributes,
  PostCreationAttributes,
} from '../Post.types';
import { Translatable } from '../localization/Translation.types';
import { Sentimental } from '../sentiment/Sentiment.types';
import { PublicSummaryAttributesConservative } from '../summary/Summary.types';

export type RecapAttributes = PostAttributes & Sentimental & Translatable & {
  key: string;
  summaries?: PublicSummaryAttributesConservative[];
  sentiments?: PublicRecapSentimentAttributes[];
};

export type RecapCreationAttributes = PostCreationAttributes & Partial<Sentimental> & {
  key: string;
};

/** light weight record for a summary post */
export const PUBLIC_RECAP_ATTRIBUTES = [...PUBLIC_POST_ATTRIBUTES] as const;

export type PublicRecapAttributes = RecapAttributes;