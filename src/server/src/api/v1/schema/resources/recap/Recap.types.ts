import {
  PUBLIC_POST_ATTRIBUTES,
  PostAttributes,
  PostCreationAttributes,
} from '../Post.types';
import { Translatable } from '../localization/Translation.types';
import { Sentimental } from '../sentiment/Sentiment.types';
import { PublicSummaryAttributes } from '../summary/Summary.types';
import { PublicSummarySentimentAttributes } from '../summary/SummarySentiment.types';

export type RecapAttributes = PostAttributes & Sentimental & Translatable & {
  key: string;
  length: string;
  summaries?: PublicSummaryAttributes[];
  sentiments?: PublicSummarySentimentAttributes[];
};

export type RecapCreationAttributes = PostCreationAttributes & Partial<Sentimental> & {
  key: string;
  length: string;
};

/** light weight record for a summary post */
export const PUBLIC_RECAP_ATTRIBUTES = [...PUBLIC_POST_ATTRIBUTES] as const;

export type PublicRecapAttributes = RecapAttributes;