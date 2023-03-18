import { Table } from 'sequelize-typescript';

import { ArticleAttributes, ArticleCreationAttributes } from './article.types';
import { TitledCategorizedPost } from '../post';

@Table({
  modelName: 'article',
  paranoid: true,
  timestamps: true,
})
export class Article extends TitledCategorizedPost<ArticleAttributes, ArticleCreationAttributes> implements ArticleAttributes {
 
}
