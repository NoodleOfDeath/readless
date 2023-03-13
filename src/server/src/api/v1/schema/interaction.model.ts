import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';
import { User } from './user/user.model';
import { InteractionType, ResourceType } from './types';

export type InteractionAttributes = DatedAttributes & {
  /** type of this interaction */
  type: InteractionType;
  /** type of the resource being interacted with */
  targetType: ResourceType;
  /** id of the resource being interacted with */
  targetId: number;
  /** if a user is logged in this is a userId */
  actorId?: number;
  /** some alternate identifier typically IP address */
  actorTag?: string;
  /** value associated with the interaction */
  value?: string;
};

export type InteractionCreationAttributes = DatedAttributes & {
  type: InteractionType;
  targetId: number;
  actorId?: number;
  actorTag?: string;
  value?: string;
};

@Table({
  modelName: 'interaction',
  timestamps: true,
  paranoid: true,
})
export class Interaction<
    A extends InteractionAttributes = InteractionAttributes,
    B extends InteractionCreationAttributes = InteractionCreationAttributes,
  >
  extends Model<A, B>
  implements InteractionAttributes
{
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Interaction>): Partial<Interaction> {
    return defaults ?? {};
  }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    type: InteractionType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    targetType: ResourceType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    targetId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
    actorId?: number;

  @Column({
    type: DataType.STRING,
  })
    actorTag?: string;

  @Column({
    type: DataType.TEXT,
  })
    value?: string;

  @BelongsTo(() => User, 'actorId')
    actor?: User;
}
