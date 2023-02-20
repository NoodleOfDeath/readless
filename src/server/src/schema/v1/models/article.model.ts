import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Reference } from './reference.model';

type ArticleCreationAttributes = {
  title: string;
  category: string;
  subcategory?: string;
  content: string;
};

@Table({
  modelName: 'article',
  timestamps: true,
  paranoid: true,
})
export class Article extends Model<Article, ArticleCreationAttributes> {
  @Column({
    allowNull: false,
  })
  title: string;

  @Column({
    allowNull: false,
  })
  category: string;

  @Column
  subcategory: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @HasMany(() => Reference, 'articleId')
  references: Reference[];

  get sources() {
    return this.references.map(async (reference) => reference.source);
  }
}
