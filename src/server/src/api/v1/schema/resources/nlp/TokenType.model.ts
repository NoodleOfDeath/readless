import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { 
  TOKEN_TYPES,
  TokenTypeAttributes,
  TokenTypeCreationAttributes,
  TokenTypeName,
} from './TokenType.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'token_type',
  paranoid: true,
  timestamps: true,
})
export class TokenType<
  A extends TokenTypeAttributes = TokenTypeAttributes, 
  B extends TokenTypeCreationAttributes = TokenTypeCreationAttributes> 
  extends BaseModel<A, B> 
  implements TokenTypeAttributes {
  
  public static async initTokenTypes() {
    for (const type of Object.values(TOKEN_TYPES)) {
      await this.upsert(type);
    }
  }
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare name: TokenTypeName;
  
  @Column({ 
    allowNull: false,
    type: DataType.STRING,
  })
  declare displayName: string;
  
}