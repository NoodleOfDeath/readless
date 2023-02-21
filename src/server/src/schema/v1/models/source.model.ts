import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { Reference } from './reference.model';
import {
  TitledCategorizedPost,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from './post';

export type SourceAttributes = TitledCategorizedPostAttributes & {
  url: string;
  filteredText: string;
};

export type SourceCreationAttributes = TitledCategorizedPostCreationAttributes & {
  url: string;
  filteredText: string;
};

@Table({
  modelName: 'source',
  timestamps: true,
  paranoid: true,
})
export class Source extends TitledCategorizedPost<SourceAttributes, SourceCreationAttributes> {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Source>): Partial<Source> {
    return defaults ?? {};
  }

  @Column({
    type: DataType.STRING(2083),
    allowNull: false,
  })
  url: string;

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
