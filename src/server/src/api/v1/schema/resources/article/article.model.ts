import { Table } from 'sequelize-typescript';

import { ARTICLE_ATTRS } from '../../types';
import {
  Attr,
  TitledCategorizedPost,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from '../../resources/post';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ArticleAttributes = TitledCategorizedPostAttributes & {};
// eslint-disable-next-line @typescript-eslint/ban-types
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

}
