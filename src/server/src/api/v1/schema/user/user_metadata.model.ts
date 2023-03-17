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
  paranoid: true,
  timestamps: true,
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
    allowNull: false,
    type: DataType.INTEGER,
  })
    userId: number;
  
  @Index({
    name: 'user_metadata_userId_key_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    key: string;
    
  @Column({
    allowNull: false,
    type: DataType.JSON,
  })
    value: Record<string, unknown>;

}
