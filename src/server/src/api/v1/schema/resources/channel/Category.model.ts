import { QueryTypes } from 'sequelize';
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  CATEGORIES,
  CategoryAttributes,
  CategoryCreationAttributes,
} from './Category.types';
import { CategoryTranslation } from './CategoryTranslation.model';
import { QueryFactory } from '../../';
import { SupportedLocale } from '../../../../../core/locales';
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
  
  public static async prepare() {
    const newCategories: Category[] = [];
    for (const category of Object.values(CATEGORIES)) {
      const [newCategory, yes] = await this.upsert(category);
      if (yes) {
        newCategories.push(newCategory);
      }
    }
    for (const category of newCategories) {
      console.log('translating', category.name);
      await CategoryTranslation.translate(category, ['displayName']);
    }
  }

  static async getCategories(locale: SupportedLocale = 'en') {
    const replacements = { locale };
    const categories: CategoryAttributes[] = await this.sql.query(QueryFactory.getQuery('get_categories'), {
      nest: true,
      replacements,
      type: QueryTypes.SELECT,
    });
    return {
      count: categories?.length ?? 0,
      rows: categories ?? [],
    };
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

  @Column({ type: DataType.BOOLEAN })
  declare disabled?: boolean;

  declare sentiment?: number;
  
}