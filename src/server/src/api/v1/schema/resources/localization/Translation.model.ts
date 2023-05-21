import { Column, DataType } from 'sequelize-typescript';

import { TranslationAttributes, TranslationCreationAttributes } from './Translation.types';
import { BaseModel } from '../../base';

export abstract class Translation<
  A extends TranslationAttributes = TranslationAttributes, 
  B extends TranslationCreationAttributes = TranslationCreationAttributes> 
  extends BaseModel<A, B> 
  implements TranslationAttributes {
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare parentId: number;
  
  @Column({ 
    allowNull: false,
    type: DataType.STRING,
  })
  declare locale: string;
  
  @Column({ 
    allowNull: false,
    type: DataType.STRING,
  })
  declare attribute: string;
    
  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare value: string;
  
}