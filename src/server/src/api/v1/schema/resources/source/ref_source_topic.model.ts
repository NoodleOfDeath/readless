import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../../dated';

export type RefSourceTopicAttributes = DatedAttributes & {
  sourceId: number;
  topicId: number;
};

export type RefSourceTopicCreationAttributes = DatedAttributes & {
  sourceId: number;
  topicId: number;
};

@Table({
  modelName: '_ref_source_topic',
  paranoid: true,
  timestamps: true,
})
export class RefSourceTopic<A extends RefSourceTopicAttributes = RefSourceTopicAttributes, B extends RefSourceTopicCreationAttributes = RefSourceTopicCreationAttributes> extends Model<A, B> implements RefSourceTopicAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<RefSourceTopic>): Partial<RefSourceTopic> {
    return defaults ?? {};
  }
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    sourceId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    topicId: number;

}