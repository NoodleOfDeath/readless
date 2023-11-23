import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { AchievementAttributes, AchievementCreationAttributes } from './Achievement.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'achievement',
  paranoid: true,
  timestamps: true,
})
export class Achievement<
  A extends AchievementAttributes = AchievementAttributes, 
  B extends AchievementCreationAttributes = AchievementCreationAttributes
> extends BaseModel<A, B> implements AchievementAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare name: string;

  @Column({ type: DataType.TEXT })
  declare description?: string;

  @Column({ type: DataType.STRING })
  declare displayName?: string;

  @Column({ type: DataType.INTEGER })
  declare points?: number;

}