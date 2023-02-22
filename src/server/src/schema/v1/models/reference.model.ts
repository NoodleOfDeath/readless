import { Table, Column, Model, Index, ForeignKey } from 'sequelize-typescript';
import { Article } from './article.model';
import { Source } from './source.model';

type ReferenceCreationAttributes = {
  articleId: number;
  sourceId: number;
};

@Table({
  modelName: 'reference',
  timestamps: true,
  paranoid: true,
})
export class Reference extends Model<Reference, ReferenceCreationAttributes> {
  @Index({ name: 'reference_articleId_sourceId', unique: true })
  @ForeignKey(() => Article)
  @Column({
    allowNull: false,
  })
  articleId: number;

  get article() {
    return Article.findByPk(this.articleId);
  }

  @Index({ name: 'reference_articleId_sourceId', unique: true })
  @ForeignKey(() => Source)
  @Column({
    allowNull: false,
  })
  sourceId: number;

  get source() {
    return Source.findByPk(this.sourceId);
  }
}
