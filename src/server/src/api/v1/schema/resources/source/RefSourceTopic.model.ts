import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { RefSourceTopicAttributes, RefSourceTopicCreationAttributes } from './RefSourceTopic.types';
import { BaseModel } from '../../base';

@Table({
  modelName: '_ref_source_topic',
  paranoid: true,
  timestamps: true,
})
export class RefSourceTopic<A extends RefSourceTopicAttributes = RefSourceTopicAttributes, B extends RefSourceTopicCreationAttributes = RefSourceTopicCreationAttributes> extends BaseModel<A, B> implements RefSourceTopicAttributes {
    
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