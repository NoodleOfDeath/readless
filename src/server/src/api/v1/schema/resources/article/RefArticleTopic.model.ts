import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  RefArticleTopicAttributes,
  RefArticleTopicCreationAttributes,
} from './RefArticleTopic.types';
import { BaseModel } from '../../base';

@Table({
  modelName: '_ref_article_topic',
  paranoid: true,
  timestamps: true,
})
export class RefArticleTopic<A extends RefArticleTopicAttributes = RefArticleTopicAttributes, B extends RefArticleTopicCreationAttributes = RefArticleTopicCreationAttributes> extends BaseModel<A, B> implements RefArticleTopicAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare articleId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare topicId: number;

}