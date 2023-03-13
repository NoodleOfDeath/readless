import { Hooks } from 'sequelize/types/hooks';
import { Model } from 'sequelize-typescript';
import { Attributes, FindAndCountOptions as SequelizeFindAndCountOptions } from 'sequelize';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FindAndCountOptions<T extends Model<any, any> | Hooks<Model<any, any>, any, any>> = Omit<
  SequelizeFindAndCountOptions<Attributes<T>>,
  'groups'
>;

export type Attr<Model, K extends keyof Model> = {
  [Key in K]: Model[Key];
};

/** light weight record for a post */
export const POST_ATTRS = ['id', 'abridged', 'summary', 'shortSummary', 'bullets', 'createdAt'] as const;
/** light weight record for a post with title, category, subcategory, and tags */
export const TITLED_CATEGORIZED_POST_ATTRS = [...POST_ATTRS, 'title', 'category', 'subcategory', 'tags'] as const;
/** light weight record for a source post */
export const SOURCE_ATTRS = [...TITLED_CATEGORIZED_POST_ATTRS, 'outletId', 'url', 'originalTitle'] as const;
/** light weight record for an article post */
export const ARTICLE_ATTRS = [...TITLED_CATEGORIZED_POST_ATTRS] as const;

export const RESOURCE_TYPES = {
  article: 'article',
  interaction: 'interaction',
  media: 'media',
  outlet: 'outlet',
  source: 'source',
} as const;
export type ResourceType = keyof typeof RESOURCE_TYPES;

export const INTERACTION_TYPES = {
  like: 'like',
  dislike: 'dislike',
  bookmark: 'bookmark',
  share: 'share',
  comment: 'comment',
  view: 'view',
} as const;

export type InteractionType = keyof typeof INTERACTION_TYPES;

