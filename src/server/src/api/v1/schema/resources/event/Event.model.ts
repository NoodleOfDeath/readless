import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';

import {
  EventAttributes,
  EventCreationAttributes,
  EventType,
} from './Event.types';
import { Duration } from '../../../../../utils';
import { BaseModel } from '../../base';

@Table({
  modelName: 'event',
  paranoid: true,
  timestamps: true,
})
export class Event<
    A extends EventAttributes = EventAttributes,
    B extends EventCreationAttributes = EventCreationAttributes,
  > extends BaseModel<A, B> implements EventAttributes {

  @Index({ unique: true })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare type: EventType;

  @Column({ type: DataType.STRING })
  declare title?: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare description?: string;

  @Column({ type: DataType.DATE })
  declare startDate?: Date;
  
  @Column({ type: DataType.STRING })
  declare duration?: Duration;

}