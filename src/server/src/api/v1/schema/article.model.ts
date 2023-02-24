import { HasMany, Table } from 'sequelize-typescript';
import {
  Attr,
  TitledCategorizedPost,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from './post';
import { ARTICLE_ATTRS } from './types';
import { Reference } from './reference.model';

export type ArticleAttributes = TitledCategorizedPostAttributes & {};
export type ArticleCreationAttributes = TitledCategorizedPostCreationAttributes & {};

export type ArticleAttr = Attr<Article, (typeof ARTICLE_ATTRS)[number]>;

@Table({
  modelName: 'article',
  timestamps: true,
  paranoid: true,
})
export class Article extends TitledCategorizedPost<ArticleAttributes, ArticleCreationAttributes> {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Article>): Partial<Article> {
    return defaults ?? {};
  }

  @HasMany(() => Reference, 'articleId')
  references: Reference[];

  get sources() {
    return this.references.map(async (reference) => reference.source);
  }
}
