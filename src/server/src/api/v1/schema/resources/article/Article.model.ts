import { Table } from 'sequelize-typescript';

import { ArticleAttributes, ArticleCreationAttributes } from './Article.types';
import { ArticleInteraction } from './ArticleInteraction.model';
import { InteractionType } from '../../interaction/Interaction.types';
import { TitledCategorizedPost } from '../Post.model';

@Table({
  modelName: 'article',
  paranoid: true,
  timestamps: true,
})
export class Article extends TitledCategorizedPost<ArticleInteraction, ArticleAttributes, ArticleCreationAttributes> implements ArticleAttributes {
 
  async getInteractions(userId?: number, type?: InteractionType | InteractionType[]) {
    return undefined;
  }
  
}
