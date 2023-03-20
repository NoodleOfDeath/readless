import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  FetchPolicy,
  OutletAttributes,
  OutletCreationAttributes,
  SiteMap,
} from './Outlet.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'outlet',
  paranoid: true,
  timestamps: true,
})
export class Outlet<
    A extends OutletAttributes = OutletAttributes,
    B extends OutletCreationAttributes = OutletCreationAttributes,
  >
  extends BaseModel<A, B>
  implements OutletAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
    name: string;

  @Column({
    allowNull: false,
    type: DataType.ARRAY(DataType.JSON),
  })
    siteMaps: SiteMap[];

  @Column({ type: DataType.JSON })
    fetchPolicy: FetchPolicy;

}
