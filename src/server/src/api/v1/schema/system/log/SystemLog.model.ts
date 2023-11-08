import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  SystemLogAttributes,
  SystemLogCreationAttributes,
  SystemLogLevel,
} from './SystemLog.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'log',
  paranoid: true,
  timestamps: true,
})
export class SystemLog<
    A extends SystemLogAttributes = SystemLogAttributes,
    B extends SystemLogCreationAttributes = SystemLogCreationAttributes,
  >
  extends BaseModel<A, B>
  implements SystemLogAttributes {

  type: SystemLogLevel;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare level: SystemLogLevel;

  @Column({
    defaultValue: '', 
    type: DataType.TEXT, 
  })
  declare message: string;

}
