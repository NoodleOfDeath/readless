import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { RefTopicMediaAttributes, RefTopicMediaCreationAttributes } from './RefTopicMedia.types';
import { BaseModel } from '../../base';

@Table({
  modelName: '_ref_topic_media',
  paranoid: true,
  timestamps: true,
})
export class RefTopicMedia<A extends RefTopicMediaAttributes = RefTopicMediaAttributes, B extends RefTopicMediaCreationAttributes = RefTopicMediaCreationAttributes> extends BaseModel<A, B> implements RefTopicMediaAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    topicId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    mediaId: number;
    
}