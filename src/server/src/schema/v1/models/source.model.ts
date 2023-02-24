import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { Reference } from './reference.model';
import {
  Attr,
  TitledCategorizedPost,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from './post';
import { SOURCE_ATTRS } from './types';

export type SourceAttributes = TitledCategorizedPostAttributes & {
  url: string;
  filteredText: string;
  alternateTitle: string;
};

export type SourceCreationAttributes = TitledCategorizedPostCreationAttributes & {
  url: string;
  filteredText: string;
  alternateTitle: string;
};

export type SourceAttr = Attr<Source, (typeof SOURCE_ATTRS)[number]>;

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

  @Column({
    type: DataType.STRING(1024),
    allowNull: false,
  })
  alternateTitle: string;

  @HasMany(() => Reference, 'sourceId')
  references: Reference[];

  get articles() {
    return this.references.map(async (reference) => reference.article);
  }
}
