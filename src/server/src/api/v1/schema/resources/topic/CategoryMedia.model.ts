import { Table } from 'sequelize-typescript';

import { CategoryMediaAttributes, CategoryMediaCreationAttributes } from './CategoryMedia.types';
import { Media } from '../Media.model';

@Table({
  modelName: 'category_media',
  paranoid: true,
  timestamps: true,
})
export class CategoryMedia<A extends CategoryMediaAttributes = CategoryMediaAttributes, B extends CategoryMediaCreationAttributes = CategoryMediaCreationAttributes> extends Media<A, B> implements CategoryMediaAttributes {}