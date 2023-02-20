import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Reference } from './reference.model';

type SourceAttributes = {
  id: number;
  title: string;
  url: string;
  rawText: string;
  filteredText: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type SourceCreationAttributes = {
  title: string;
  url: string;
  rawText: string;
  filteredText: string;
};

@Table({
  modelName: 'source',
  timestamps: true,
  paranoid: true,
})
export class Source extends Model<SourceAttributes, SourceCreationAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING(2083),
    allowNull: false,
  })
  url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  rawText: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  filteredText: string;

  @HasMany(() => Reference, 'sourceId')
  references: Reference[];

  get articles() {
    return this.references.map(async (reference) => reference.article);
  }
}
