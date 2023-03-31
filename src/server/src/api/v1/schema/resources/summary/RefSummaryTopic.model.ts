import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  RefSummaryTopicAttributes,
  RefSummaryTopicCreationAttributes,
} from './RefSummaryTopic.types';
import { BaseModel } from '../../base';

@Table({
  modelName: '_ref_summary_topic',
  paranoid: true,
  timestamps: true,
})
export class RefSummaryTopic<A extends RefSummaryTopicAttributes = RefSummaryTopicAttributes, B extends RefSummaryTopicCreationAttributes = RefSummaryTopicCreationAttributes> extends BaseModel<A, B> implements RefSummaryTopicAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare sourceId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare topicId: number;

}