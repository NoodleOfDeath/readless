import {
  Column, DataType, Model, Table, 
} from 'sequelize-typescript';

import { DatedAttributes } from '../../dated';

export type TopicAttributes = DatedAttributes & {
  name: string;
  description: string;
};

export type TopicCreationAttributes = DatedAttributes & {
  name: string;
  description: string;
};

@Table({
  modelName: 'topic',
  timestamps: true,
  paranoid: true,
})
export class Topic<A extends TopicAttributes = TopicAttributes, B extends TopicCreationAttributes = TopicCreationAttributes>
  extends Model<A, B>
  implements TopicAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Topic>): Partial<Topic> {
    return defaults ?? {};
  }
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    name: string;
  
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
    description: string;

}
