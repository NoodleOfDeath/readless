import { Table } from 'sequelize-typescript';

import { ArticleMediaAttributes, ArticleMediaCreationAttributes } from './ArticleMedia.types';
import { Media } from '../Media.model';

@Table({
  modelName: 'article_media',
  paranoid: true,
  timestamps: true,
})
export class ArticleMedia<A extends ArticleMediaAttributes = ArticleMediaAttributes, B extends ArticleMediaCreationAttributes = ArticleMediaCreationAttributes> extends Media<A, B> implements ArticleMediaAttributes {}