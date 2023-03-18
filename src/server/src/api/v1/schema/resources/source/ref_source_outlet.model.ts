import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  RefSourceOutletAttributes,
  RefSourceOutletCreationAttributes,
} from './ref_source_outlet.types';
import { BaseModel } from '../../base';

@Table({
  modelName: '_ref_source_outlet',
  paranoid: true,
  timestamps: true,
})
export class RefSourceOutlet<A extends RefSourceOutletAttributes = RefSourceOutletAttributes, B extends RefSourceOutletCreationAttributes = RefSourceOutletCreationAttributes> extends BaseModel<A, B> implements RefSourceOutletAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    sourceId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    outletId: number;

}