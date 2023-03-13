import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from '../dated';
import { Media } from '../media.model';
import { Topic } from './topic.model';

export type TopicMediaAttributes = DatedAttributes & {
  topicId: number;
  mediaId: number;
};

export type TopicMediaCreationAttributes = DatedAttributes & {
  topicId: number;
  mediaId: number;
};

@Table({
  modelName: 'topic_media',
  timestamps: true,
  paranoid: true,
})
export class TopicMedia<A extends TopicMediaAttributes = TopicMediaAttributes, B extends TopicMediaCreationAttributes = TopicMediaCreationAttributes> extends Model<A, B> implements TopicMediaAttributes {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<TopicMedia>): Partial<TopicMedia> {
    return defaults ?? {};
  }
    
  @ForeignKey(() => Topic)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    topicId: number;
  
  @ForeignKey(() => Media)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    mediaId: number;
    
  async topic() {
    return await Topic.findByPk(this.topicId);
  }
  
  async media() {
    return await Media.findByPk(this.mediaId);
  }
    
}