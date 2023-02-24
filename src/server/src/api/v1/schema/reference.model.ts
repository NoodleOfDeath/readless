import { Column, DataType, ForeignKey, Index, Model, Table } from 'sequelize-typescript';
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
    type: DataType.INTEGER,
    allowNull: false,
  })
  articleId: number;

  get article() {
    return Article.findByPk(this.articleId);
  }

  @Index({ name: 'reference_articleId_sourceId', unique: true })
  @ForeignKey(() => Source)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sourceId: number;

  get source() {
    return Source.findByPk(this.sourceId);
  }
}
