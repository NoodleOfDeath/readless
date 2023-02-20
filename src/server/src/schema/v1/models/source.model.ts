import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Reference } from './reference.model';

type SourceAttributes = {
  id: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type SourceCreationAttributes = {
  url: string;
};

@Table({
  modelName: 'source',
  timestamps: true,
  paranoid: true,
})
export class Source extends Model<SourceAttributes, SourceCreationAttributes> {
  @Column({
    type: DataType.STRING(2083),
    allowNull: false,
  })
  url: string;

  @HasMany(() => Reference, 'sourceId')
  references: Reference[];

  get articles() {
    return this.references.map(async (reference) => reference.article);
  }
}
