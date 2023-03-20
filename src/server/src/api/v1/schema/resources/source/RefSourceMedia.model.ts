import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { RefSourceMediaAttributes, RefSourceMediaCreationAttributes } from './RefSourceMedia.types';
import { BaseModel } from '../../base';

@Table({
  modelName: '_ref_source_media',
  paranoid: true,
  timestamps: true,
})
export class RefSourceMedia<A extends RefSourceMediaAttributes = RefSourceMediaAttributes, B extends RefSourceMediaCreationAttributes = RefSourceMediaCreationAttributes> extends BaseModel<A, B> implements RefSourceMediaAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    sourceId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    mediaId: number;

}