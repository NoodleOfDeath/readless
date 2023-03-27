import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { TopicAttributes, TopicCreationAttributes } from './Topic.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'topic',
  paranoid: true,
  timestamps: true,
})
export class Topic<A extends TopicAttributes = TopicAttributes, B extends TopicCreationAttributes = TopicCreationAttributes>
  extends BaseModel<A, B>
  implements TopicAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    name: string;
  
  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    description: string;

}
