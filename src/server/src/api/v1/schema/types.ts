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
