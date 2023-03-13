import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from '../dated';
import { Source } from './source.model';
import { Topic } from '../topic/topic.model';

export type SourceTopicAttributes = DatedAttributes & {
  sourceId: number;
  topicId: number;
};

export type SourceTopicCreationAttributes = DatedAttributes & {
  sourceId: number;
  topicId: number;
};

@Table({
  modelName: 'source_topic',
  timestamps: true,
  paranoid: true,
})
export class SourceTopic<A extends SourceTopicAttributes = SourceTopicAttributes, B extends SourceTopicCreationAttributes = SourceTopicCreationAttributes> extends Model<A, B> implements SourceTopicAttributes {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<SourceTopic>): Partial<SourceTopic> {
    return defaults ?? {};
  }
    
  @ForeignKey(() => Source)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    sourceId: number;
  
  @ForeignKey(() => Topic)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    topicId: number;
  
  async source() {
    return await Source.findByPk(this.sourceId);
  }
    
  async topic() { 
    return await Topic.findByPk(this.topicId);
  }

}