import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  InteractionAttributes,
  InteractionCreationAttributes,
  InteractionType,
} from './interaction.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'interaction',
  paranoid: true,
  timestamps: true,
})
export class Interaction<
    A extends InteractionAttributes = InteractionAttributes,
    B extends InteractionCreationAttributes = InteractionCreationAttributes,
  >
  extends BaseModel<A, B>
  implements InteractionAttributes {

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    actorId: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    type: InteractionType;

  @Column({ type: DataType.TEXT })
    value?: string;

}
