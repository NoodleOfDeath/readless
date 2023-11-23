import { Column, DataType } from 'sequelize-typescript';

import { MetadataAttributes, MetadataCreationAttributes } from './Metadata.types';
import { BaseModel } from '../base';

export abstract class Metadata<
    Key extends string, 
    Group extends string,
    A extends MetadataAttributes<Key, Group> = MetadataAttributes<Key, Group>,
    B extends MetadataCreationAttributes<Key, Group> = MetadataCreationAttributes<Key, Group>,
  > extends BaseModel<A, B> implements MetadataAttributes<Key, Group> {

  @Column({ type: DataType.INTEGER })
  declare parentId: number;
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare key: Key;
  
  @Column({ type: DataType.STRING })
  declare group?: Group;

  @Column({
    allowNull: false, 
    type: DataType.JSON,
  })
  declare value: Record<string, unknown> | string;

}