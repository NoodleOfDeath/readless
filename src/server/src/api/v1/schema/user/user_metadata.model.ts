import {
  Column,
  DataType,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type UserMetadataAttributes = DatedAttributes & {
  userId: number;
  key: string;
  value: Record<string, unknown>;
};

export type UserMetadataCreationAttributes = DatedAttributes & {
  userId: number;
  key: string;
  value: Record<string, unknown>;
};

@Table({
  modelName: 'user_metadata',
  timestamps: true,
  paranoid: true,
})
export class UserMetadata<A extends UserMetadataAttributes = UserMetadataAttributes, B extends UserMetadataCreationAttributes = UserMetadataCreationAttributes>
  extends Model<A, B>
  implements UserMetadataAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<UserMetadata>): Partial<UserMetadata> {
    return defaults ?? {};
  }
  
  @Index({
    name: 'user_metadata_userId_key_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    userId: number;
  
  @Index({
    name: 'user_metadata_userId_key_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    key: string;
    
  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
    value: Record<string, unknown>;

}
