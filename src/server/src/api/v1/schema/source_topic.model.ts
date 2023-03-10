import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';
import { Source } from './source.model';
import { Topic } from './topic.model';

export type SourceTopicAttributes = DatedAttributes & {
  topicId: number;
  sourceId: number;
};

export type SourceTopicCreationAttributes = DatedAttributes & {
  topicId: number;
  sourceId: number;
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
  
  @ForeignKey(() => Topic)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    topicId: number;
    
  @ForeignKey(() => Source)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    sourceId: number;
    
  get topic() { 
    return Topic.findByPk(this.topicId);
  }
  
  get source() {
    return Source.findByPk(this.sourceId);
  }

}