import {
  AfterFind,
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { SourceCreationAttributes, SourceWithOutletName } from './Source.types';
import { TitledCategorizedPost } from '../Post';
import { Outlet } from '../outlet/Outlet.model';

@Table({
  modelName: 'source',
  paranoid: true,
  timestamps: true,
})
export class Source extends TitledCategorizedPost<SourceWithOutletName, SourceCreationAttributes> implements SourceWithOutletName {
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    outletId: number;
  
  outletName: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
    unique: true,
  })
    url: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    rawText: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    filteredText: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
    originalTitle: string;
  
  @AfterFind
  static async addOutletName(cursor?: Source | Source[]) {
    if (!cursor) {
      return;
    }
    const sources = Array.isArray(cursor) ? cursor : [cursor];
    const outletIds = sources.map((source) => {
      return source.toJSON().outletId;
    });
    const outlets = await Outlet.findAll({ where: { id: outletIds } });
    sources.forEach((source) => {
      const outlet = outlets.find((o) => o.id === source.toJSON().outletId);
      source.set('outletName', outlet?.toJSON().name ?? '', { raw: true });
    });
  }

}
