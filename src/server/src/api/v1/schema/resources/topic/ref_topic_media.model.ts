import {
  Column, DataType, Model, Table 
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
  timestamps: true,
  paranoid: true,
})
export class RefTopicMedia<A extends RefTopicMediaAttributes = RefTopicMediaAttributes, B extends RefTopicMediaCreationAttributes = RefTopicMediaCreationAttributes> extends Model<A, B> implements RefTopicMediaAttributes {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<RefTopicMedia>): Partial<RefTopicMedia> {
    return defaults ?? {};
  }
    
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    topicId: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    mediaId: number;
    
}