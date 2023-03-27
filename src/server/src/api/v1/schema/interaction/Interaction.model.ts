import { Column, DataType } from 'sequelize-typescript';

import {
  InteractionAttributes,
  InteractionCreationAttributes,
  InteractionType,
} from './Interaction.types';
import { BaseModel } from '../base';

export abstract class Interaction<
    A extends InteractionAttributes = InteractionAttributes,
    B extends InteractionCreationAttributes = InteractionCreationAttributes,
  >
  extends BaseModel<A, B>
  implements InteractionAttributes {

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    userId: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    targetId: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    type: InteractionType;

  @Column({ type: DataType.TEXT })
    content?: string;
    
  @Column({ type: DataType.JSON })
    metadata?: Record<string, unknown>;

}
