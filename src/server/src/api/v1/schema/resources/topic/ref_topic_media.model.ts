import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../../dated';

export type RefTopicMediaAttributes = DatedAttributes & {
  topicId: number;
  mediaId: number;
};

export type RefTopicMediaCreationAttributes = DatedAttributes & {
  topicId: number;
  mediaId: number;
};

@Table({
  modelName: '_ref_topic_media',
  paranoid: true,
  timestamps: true,
})
export class RefTopicMedia<A extends RefTopicMediaAttributes = RefTopicMediaAttributes, B extends RefTopicMediaCreationAttributes = RefTopicMediaCreationAttributes> extends Model<A, B> implements RefTopicMediaAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<RefTopicMedia>): Partial<RefTopicMedia> {
    return defaults ?? {};
  }
    
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