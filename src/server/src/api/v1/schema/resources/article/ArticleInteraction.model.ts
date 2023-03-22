import { Table } from 'sequelize-typescript';

import {
  ArticleInteractionAttributes,
  ArticleInteractionCreationAttributes,
} from './ArticleInteraction.types';
import { Interaction } from '../../interaction/Interaction.model';

@Table({
  modelName: 'article_interaction',
  paranoid: true,
  timestamps: true,
})
export class ArticleInteraction<A extends ArticleInteractionAttributes = ArticleInteractionAttributes, B extends ArticleInteractionCreationAttributes = ArticleInteractionCreationAttributes> extends Interaction<A, B> implements ArticleInteractionAttributes {}