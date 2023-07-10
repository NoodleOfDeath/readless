import { Table } from 'sequelize-typescript';

import {
  CategoryTranslationAttributes,
  CategoryTranslationCreationAttributes,
} from './CategoryTranslation.types';
import { Translation } from '../localization/Translation.model';

@Table({
  modelName: 'category_translation',
  paranoid: true,
  timestamps: true,
})
export class CategoryTranslation<A extends CategoryTranslationAttributes = CategoryTranslationAttributes, B extends CategoryTranslationCreationAttributes = CategoryTranslationCreationAttributes> extends Translation<A, B> implements CategoryTranslationAttributes {

}