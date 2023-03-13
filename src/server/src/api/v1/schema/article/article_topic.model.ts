import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from '../dated';
import { Article } from './article.model';
import { Topic } from '../topic/topic.model';

export type ArticleTopicAttributes = DatedAttributes & {
  articleId: number;
  topicId: number;
};

export type ArticleTopicCreationAttributes = DatedAttributes & {
  articleId: number;
  topicId: number;
};

@Table({
  modelName: 'article_topic',
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
    
  @ForeignKey(() => Article)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    articleId: number;
  
  @ForeignKey(() => Topic)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    topicId: number;
    
  async article() {
    return await Article.findByPk(this.articleId);
  }

  async topic() {
    return await Topic.findByPk(this.topicId);
  }
    
}