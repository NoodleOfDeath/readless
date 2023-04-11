
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { Platform, ReleaseAttributes } from './Release.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'release',
  paranoid: true,
  timestamps: true,
})
export class Release extends BaseModel<ReleaseAttributes, ReleaseAttributes> implements ReleaseAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare platform: Platform;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare version: string;

  @Column({ type: DataType.TEXT })
  declare description?: string;
    
}
