import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { MediaAttributes, MediaCreationAttributes } from './Media.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'media',
  paranoid: true,
  timestamps: true,
})
export class Media<
    A extends MediaAttributes = MediaAttributes,
    B extends MediaCreationAttributes = MediaCreationAttributes,
  >
  extends BaseModel<A, B>
  implements MediaAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    type: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
  })
    url: string;

}
