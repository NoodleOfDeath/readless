import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { RefOutletMediaAttributes, RefOutletMediaCreationAttributes } from './RefOutletMedia.types';
import { BaseModel } from '../../base';

@Table({
  modelName: '_ref_outlet_media',
  paranoid: true,
  timestamps: true,
})
export class RefOutletMedia<A extends RefOutletMediaAttributes = RefOutletMediaAttributes, B extends RefOutletMediaCreationAttributes = RefOutletMediaCreationAttributes> extends BaseModel<A, B> implements RefOutletMediaAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    outletId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    mediaId: number;
    
}