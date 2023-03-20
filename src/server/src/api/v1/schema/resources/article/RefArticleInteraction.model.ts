import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  RefArticleInteractionAttributes,
  RefArticleInteractionCreationAttributes,
} from './RefArticleInteraction.types';
import { BaseModel } from '../../base';

@Table({
  modelName: '_ref_article_interaction',
  paranoid: true,
  timestamps: true,
})
export class RefArticleInteraction<A extends RefArticleInteractionAttributes = RefArticleInteractionAttributes, B extends RefArticleInteractionCreationAttributes = RefArticleInteractionCreationAttributes> extends BaseModel<A, B> implements RefArticleInteractionAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    articleId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    interactionId: number;

}