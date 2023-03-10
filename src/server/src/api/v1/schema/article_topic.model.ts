import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';
import { Article } from './article.model';
import { Topic } from './topic.model';

export type ArticleTopicAttributes = DatedAttributes & {
  topicId: number;
  articleId: number;
};

export type ArticleTopicCreationAttributes = DatedAttributes & {
  topicId: number;
  articleId: number;
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
  
  @ForeignKey(() => Topic)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    topicId: number;
    
  @ForeignKey(() => Article)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    articleId: number;
    
  get topic() { 
    return Topic.findByPk(this.topicId);
  }
  
  get article() {
    return Article.findByPk(this.articleId);
  }

}