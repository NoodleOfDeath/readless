import { Attributes, FindAndCountOptions as SequelizeFindAndCountOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { Hooks } from 'sequelize/types/hooks';

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
export const SOURCE_ATTRS = [...TITLED_CATEGORIZED_POST_ATTRS, 'url', 'originalTitle'] as const;
/** light weight record for an article post */
export const ARTICLE_ATTRS = [...TITLED_CATEGORIZED_POST_ATTRS] as const;

export const INTERACTION_TYPES = ['like', 'dislike', 'bookmark', 'share', 'comment'] as const;
export type InteractionType = typeof INTERACTION_TYPES[number];

export const RESOURCE_TYPES = ['article', 'interaction', 'media', 'outlet', 'source'] as const;
export type ResourceType = typeof RESOURCE_TYPES[number];
