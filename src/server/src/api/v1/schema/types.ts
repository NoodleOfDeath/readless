import { Attributes, FindAndCountOptions as SequelizeFindAndCountOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { Hooks } from 'sequelize/types/hooks';

export type FindAndCountOptions<T extends Model<any, any> | Hooks<Model<any, any>, any, any>> = Omit<
  SequelizeFindAndCountOptions<Attributes<T>>,
  'groups'
>;

export const POST_ATTRS = ['id', 'tags', 'abridged', 'summary', 'shortSummary', 'createdAt'] as const;
export const TITLED_CATEGORIZED_POST_ATTRS = [...POST_ATTRS, 'title', 'category', 'subcategory'] as const;
export const SOURCE_ATTRS = [...TITLED_CATEGORIZED_POST_ATTRS, 'url', 'alternateTitle'] as const;
export const ARTICLE_ATTRS = [...TITLED_CATEGORIZED_POST_ATTRS] as const;

export const INTERACTION_TYPES = ['like', 'dislike', 'bookmark', 'share', 'comment'] as const;
export type InteractionType = typeof INTERACTION_TYPES[number];

export const RESOURCE_TYPES = ['article', 'interaction', 'media', 'outlet', 'source'] as const;
export type ResourceType = typeof RESOURCE_TYPES[number];
