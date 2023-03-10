import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';
import { Article } from './article.model';
import { Source } from './source.model';

export type ArticleSourceAttributes = DatedAttributes & {
  articleId: number;
  sourceId: number;
};

export type ArticleSourceCreationAttributes = DatedAttributes & {
  articleId: number;
  sourceId: number;
};

@Table({
  modelName: 'article_source',
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
    
  @ForeignKey(() => Article)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    articleId: number;
  
  @ForeignKey(() => Source)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    sourceId: number;
  
  get article() {
    return Article.findByPk(this.articleId);
  }
    
  get source() { 
    return Source.findByPk(this.sourceId);
  }

}