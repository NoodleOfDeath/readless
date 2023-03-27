import {
  Attr,
  TITLED_CATEGORIZED_POST_ATTRS,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from '../Post.types';

/** light weight record for an article post */
export const ARTICLE_ATTRS = [...TITLED_CATEGORIZED_POST_ATTRS] as const;

export type ArticleAttributes = TitledCategorizedPostAttributes;
export type ArticleCreationAttributes = TitledCategorizedPostCreationAttributes;
export type ArticleAttr = Attr<ArticleAttributes, (typeof ARTICLE_ATTRS)[number]>;