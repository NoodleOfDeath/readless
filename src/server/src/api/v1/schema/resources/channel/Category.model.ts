import {
  AfterFind,
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  CATEGORIES,
  CategoryAttributes,
  CategoryCreationAttributes,
} from './Category.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'category',
  paranoid: true,
  timestamps: true,
})
export class Category<
  A extends CategoryAttributes = CategoryAttributes, 
  B extends CategoryCreationAttributes = CategoryCreationAttributes> 
  extends BaseModel<A, B> 
  implements CategoryAttributes {
  
  public static async initCategories() {
    for (const category of Object.values(CATEGORIES)) {
      await this.upsert(category);
    }
  }

  @AfterFind
  static async legacySupport(cursor: Category | Category[]) {
    if (!cursor) {
      return;
    }
    const categories = Array.isArray(cursor) ? cursor : [cursor];
    for (const category of categories) {
      category.set('sentiment', 0, { raw: true });
    }
  }
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare name: string;
  
  @Column({ 
    allowNull: false,
    type: DataType.STRING,
  })
  declare displayName: string;
    
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare icon: string;

  declare sentiment?: number;
  
}