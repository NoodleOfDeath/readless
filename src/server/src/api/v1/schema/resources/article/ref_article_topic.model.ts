import {
  Column, DataType, Model, Table 
} from 'sequelize-typescript';

import { DatedAttributes } from '../../dated';

export type ArticleTopicAttributes = DatedAttributes & {
  articleId: number;
  topicId: number;
};

export type ArticleTopicCreationAttributes = DatedAttributes & {
  articleId: number;
topicId: number;
};

@Table({
  modelName: '_ref_article_topic',
  timestamps: true,
  paranoid: true,
})
export class ArticleTopic<A extends ArticleTopicAttributes = ArticleTopicAttributes, B extends ArticleTopicCreationAttributes = ArticleTopicCreationAttributes> extends Model<A, B> implements ArticleTopicAttributes {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<ArticleTopic>): Partial<ArticleTopic> {
    return defaults ?? {};
  }
    
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    articleId: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    topicId: number;
    
}