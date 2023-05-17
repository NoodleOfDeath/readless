import { Column, DataType } from 'sequelize-typescript';

import { TokenAttributes, TokenCreationAttributes } from './Token.types';
import { TokenTypeName } from './TokenType.types';
import { BaseModel } from '../../base';

export abstract class Token<
    A extends TokenAttributes = TokenAttributes,
    B extends TokenCreationAttributes = TokenCreationAttributes,
  > extends BaseModel<A, B> implements TokenAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare parentId: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare text: string;
  
  @Column({ type: DataType.STRING })
  declare type?: TokenTypeName;
  
}