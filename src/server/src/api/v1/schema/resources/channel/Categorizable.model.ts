import { Column, DataType } from 'sequelize-typescript';

import { CategorizableAttributes, CategorizableCreationAttributes } from './Categorizable.types';
import { BaseModel } from '../../base';

export class Categorizable<
  A extends CategorizableAttributes = CategorizableAttributes, 
  B extends CategorizableCreationAttributes = CategorizableCreationAttributes> 
  extends BaseModel<A, B> 
  implements CategorizableAttributes {
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare parentId: number;
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare category: string;
  
}