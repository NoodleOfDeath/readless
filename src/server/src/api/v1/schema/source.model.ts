import { AfterFind, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';

import { Attachment } from './attachment.model';
import { Outlet } from './outlet.model';
import {  SOURCE_ATTRS } from './types';
import {
  Attr,
  TitledCategorizedPost,
  TitledCategorizedPostAttributes,
  TitledCategorizedPostCreationAttributes,
} from './post';

export type SourceAttributes = TitledCategorizedPostAttributes & {
  outletId: number;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
};
export type SourceWithOutletName = SourceAttributes & { outletName: string };

export type SourceCreationAttributes = TitledCategorizedPostCreationAttributes & {
  outletId: number;
  url: string;
  rawText: string;
  filteredText: string;
  originalTitle: string;
};

export type SourceAttr = Attr<Source, typeof SOURCE_ATTRS[number]>;
export type SourceWithOutletAttr = SourceAttr & { outletName: string };

export type ReadAndSummarizeSourcePayload = {
  url: string;
};

@Table({
  modelName: 'source',
  timestamps: true,
  paranoid: true,
})
export class Source extends TitledCategorizedPost<SourceWithOutletName, SourceCreationAttributes> implements SourceWithOutletName {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Source>): Partial<Source> {
    return defaults ?? {};
  }
  
  
  @ForeignKey(() => Outlet)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    outletId: number;
  
  outletName: string;

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
    type: DataType.TEXT,
    allowNull: false,
  })
    filteredText: string;

  @Column({
    type: DataType.STRING(1024),
    allowNull: false,
  })
    originalTitle: string;

  get attachments(): Promise<Attachment[]> {
    return Attachment.findAll({
      where: {
        resourceType: 'article',
        resourceId: this.id,
      },
    });
  }
  
  @AfterFind
  static async addOutletName(sources?: Source[]) {
    if (!sources) return;
    const outletIds = sources.map((source) => {
      return source.toJSON().outletId;
    });
    const outlets = await Outlet.findAll({
      where: {
        id: outletIds,
      },
    });
    sources.forEach((source) => {
      const outlet = outlets.find((o) => o.id === source.toJSON().outletId);
      source.set('outletName', outlet?.toJSON().name ?? '', {
        raw: true,
      });
    });
  }

}
