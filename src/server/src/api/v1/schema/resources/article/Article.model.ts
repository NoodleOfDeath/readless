import { Table } from 'sequelize-typescript';

import { ArticleAttributes, ArticleCreationAttributes } from './Article.types';
import { TitledCategorizedPost } from '../Post';

@Table({
  modelName: 'article',
  paranoid: true,
  timestamps: true,
})
export class Article extends TitledCategorizedPost<ArticleAttributes, ArticleCreationAttributes> implements ArticleAttributes {
 
}
