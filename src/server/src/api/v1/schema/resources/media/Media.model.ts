import { Column, DataType } from 'sequelize-typescript';

import { 
  MediaAttributes,
  MediaCreationAttributes,
  MediaType,
} from './Media.types';
import { BaseModel } from '../../base';

export abstract class Media<
    A extends MediaAttributes = MediaAttributes,
    B extends MediaCreationAttributes = MediaCreationAttributes,
  > extends BaseModel<A, B> implements MediaAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare parentId: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
  })
  declare key: string;
  
  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
  })
  declare path: string;
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare type: MediaType;
  
  @Column({ type: DataType.STRING(2083) })
  declare url?: string;
  
  
  
}