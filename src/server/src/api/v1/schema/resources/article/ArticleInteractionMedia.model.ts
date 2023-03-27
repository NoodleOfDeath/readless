import { Table } from 'sequelize-typescript';

import {
  ArticleInteractionMediaAttributes,
  ArticleInteractionMediaCreationAttributes,
} from './ArticleInteractionMedia.types';
import { Media } from '../Media.model';

@Table({
  modelName: 'article_interaction_media',
  paranoid: true,
  timestamps: true,
})
export class ArticleInteractionMedia<A extends ArticleInteractionMediaAttributes = ArticleInteractionMediaAttributes, B extends ArticleInteractionMediaCreationAttributes = ArticleInteractionMediaCreationAttributes> extends Media<A, B> implements ArticleInteractionMediaAttributes {}