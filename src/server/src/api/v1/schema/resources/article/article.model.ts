import { Table } from 'sequelize-typescript';

import {
  Attr,
  TitledCategorizedPost,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from '../../resources/post';
import { ARTICLE_ATTRS } from '../../types';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ArticleAttributes = TitledCategorizedPostAttributes & {};
// eslint-disable-next-line @typescript-eslint/ban-types
export type ArticleCreationAttributes = TitledCategorizedPostCreationAttributes & {};

export type ArticleAttr = Attr<Article, (typeof ARTICLE_ATTRS)[number]>;

@Table({
  modelName: 'article',
  paranoid: true,
  timestamps: true,
})
export class Article extends TitledCategorizedPost<ArticleAttributes, ArticleCreationAttributes> {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Article>): Partial<Article> {
    return defaults ?? {};
  }

}
