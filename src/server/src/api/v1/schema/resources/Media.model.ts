import { Column, DataType } from 'sequelize-typescript';

import {
  MediaAttributes,
  MediaCreationAttributes,
  MediaType,
} from './Media.types';
import { BaseModel } from '../base';

export abstract class Media<
    A extends MediaAttributes = MediaAttributes,
    B extends MediaCreationAttributes = MediaCreationAttributes,
  >
  extends BaseModel<A, B>
  implements MediaAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    type: MediaType;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    parentId: number;
    
  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
  })
    url: string;

}
