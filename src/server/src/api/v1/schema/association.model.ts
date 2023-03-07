import { Column, DataType, Model, Table } from 'sequelize-typescript';

import { Article } from './article.model';
import { DatedAttributes } from './dated';
import { Source } from './source.model';

export type TopicAssociationAttributes = DatedAttributes & {
  topicId: number;
  postType: 'article' | 'source';
  postId: number;
};

export type TopicAssociationCreationAttributes = DatedAttributes & {
  topicId: number;
  postType: 'article' | 'source';
  postId: number;
};

@Table({
  modelName: 'topic_association',
  timestamps: true,
  paranoid: true,
})
export class TopicAssociation<A extends TopicAssociationAttributes = TopicAssociationAttributes, B extends TopicAssociationCreationAttributes = TopicAssociationCreationAttributes> extends Model<A, B> implements TopicAssociationAttributes {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<TopicAssociation>): Partial<TopicAssociation> {
    return defaults ?? {};
  }
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    topicId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    postType: 'article' | 'source';
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    postId: number;
    
  get post() {
    return this.postType === 'article' ? Article.findByPk(this.postId) : Source.findByPk(this.postId);
  }

}