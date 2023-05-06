import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  MessageAttributes,
  MessageCreationAttributes,
  MessageType,
} from './Message.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'message',
  paranoid: true,
  timestamps: true,
})
export class Message<
    A extends MessageAttributes = MessageAttributes,
    B extends MessageCreationAttributes = MessageCreationAttributes,
  >
  extends BaseModel<A, B>
  implements MessageAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare type: MessageType;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare title: string;

  @Column({ type: DataType.TEXT })
  declare description?: string;

}
