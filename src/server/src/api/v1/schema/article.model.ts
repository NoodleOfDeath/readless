import { Table } from 'sequelize-typescript';
import {
  Attr,
  TitledCategorizedPost,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from './post';
import { ARTICLE_ATTRS } from './types';
import { Attachment } from './attachment.model';

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

  get attachments(): Promise<Attachment[]> {
    return Attachment.findAll({
      where: {
        resourceType: 'article',
        resourceId: this.id,
      },
    });
  }
}
