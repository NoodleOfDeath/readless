import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';

import { 
  MetadataType,
  UserMetadataAttributes, 
  UserMetadataCreationAttributes,
} from './UserMetadata.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'user_metadata',
  paranoid: true,
  timestamps: true,
})
export class UserMetadata<A extends UserMetadataAttributes = UserMetadataAttributes, B extends UserMetadataCreationAttributes = UserMetadataCreationAttributes>
  extends BaseModel<A, B>
  implements UserMetadataAttributes {
  
  @Index({
    name: 'user_metadata_userId_key_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare userId: number;
  
  @Index({
    name: 'user_metadata_userId_key_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare key: string;
    
  @Column({
    allowNull: false,
    type: DataType.JSON,
  })
  declare value: Record<string, unknown> | string;

  @Column({
    defaultValue: 'pref',
    type: DataType.STRING,
  })
  declare type: MetadataType;
  
}
