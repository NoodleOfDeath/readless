import { Column, DataType } from 'sequelize-typescript';

import {
  InteractionAttributes,
  InteractionCreationAttributes,
  InteractionType,
} from './Interaction.types';
import { BaseModel } from '../../base';

export abstract class Interaction<
  A extends InteractionAttributes = InteractionAttributes,
  B extends InteractionCreationAttributes = InteractionCreationAttributes,
>
  extends BaseModel<A, B>
  implements InteractionAttributes {

  @Column({ type: DataType.INTEGER })
  declare userId?: number;

  @Column({ type: DataType.STRING(2083) })
  declare remoteAddr?: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare targetId: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare type: InteractionType;

  @Column({ type: DataType.TEXT })
  declare content?: string;
    
  @Column({ type: DataType.JSON })
  declare metadata?: Record<string, unknown>;

}
