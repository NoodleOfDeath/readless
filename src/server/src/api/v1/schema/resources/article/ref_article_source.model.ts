import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../../dated';

export type ArticleSourceAttributes = DatedAttributes & {
  articleId: number;
  sourceId: number;
};

export type ArticleSourceCreationAttributes = DatedAttributes & {
  articleId: number;
  sourceId: number;
};

@Table({
  modelName: '_ref_article_source',
  timestamps: true,
  paranoid: true,
})
export class ArticleSource<A extends ArticleSourceAttributes = ArticleSourceAttributes, B extends ArticleSourceCreationAttributes = ArticleSourceCreationAttributes> extends Model<A, B> implements ArticleSourceAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<ArticleSource>): Partial<ArticleSource> {
    return defaults ?? {};
  }
    
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    articleId: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    sourceId: number;
  
}