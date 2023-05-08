import {
  Column,
  DataType,
  Index,
} from 'sequelize-typescript';

import { TokenAttributes, TokenCreationAttributes } from './Token.types';
import { BaseModel } from '../../base';

export abstract class Token<
    A extends TokenAttributes = TokenAttributes,
    B extends TokenCreationAttributes = TokenCreationAttributes,
  > extends BaseModel<A, B> implements TokenAttributes {
    
  @Index({
    name: 'token_parent_id_text_unique',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare parentId: number;

  @Index({
    name: 'token_parent_id_text_unique',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare text: string;
  
}