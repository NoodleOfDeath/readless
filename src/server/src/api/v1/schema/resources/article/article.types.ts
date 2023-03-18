import {
  Attr,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from '../../resources/post.types';
import { TITLED_CATEGORIZED_POST_ATTRS } from '../post.types';

/** light weight record for an article post */
export const ARTICLE_ATTRS = [...TITLED_CATEGORIZED_POST_ATTRS] as const;

export type ArticleAttributes = TitledCategorizedPostAttributes;
export type ArticleCreationAttributes = TitledCategorizedPostCreationAttributes;
export type ArticleAttr = Attr<ArticleAttributes, (typeof ARTICLE_ATTRS)[number]>;