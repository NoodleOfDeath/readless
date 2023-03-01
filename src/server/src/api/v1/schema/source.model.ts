import { Column, DataType, Table } from 'sequelize-typescript';
import { SOURCE_ATTRS } from './types';
import {
  Attr,
  TitledCategorizedPost,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from './post';
import { Attachment } from './attachment.model';

export type SourceAttributes = TitledCategorizedPostAttributes & {
  url: string;
  rawText: string;
  alternateTitle: string;
};

export type SourceCreationAttributes = TitledCategorizedPostCreationAttributes & {
  url: string;
  rawText: string;
  alternateTitle: string;
};

export type SourceAttr = Attr<Source, typeof SOURCE_ATTRS[number]>;

export type ReadAndSummarizeSourcePayload = {
  url: string;
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
    unique: true,
  })
  url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  rawText: string;

  @Column({
    type: DataType.STRING(1024),
    allowNull: false,
  })
  alternateTitle: string;

  get attachments(): Promise<Attachment[]> {
    return Attachment.findAll({
      where: {
        resourceType: 'article',
        resourceId: this.id,
      },
    });
  }
}
