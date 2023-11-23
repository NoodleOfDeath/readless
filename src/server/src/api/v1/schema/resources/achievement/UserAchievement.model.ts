import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  UserAchievementAttributes,
  UserAchievementCreationAttributes,
} from './UserAchievement.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'user_achievement',
  paranoid: true,
  timestamps: true,
})
export class UserAchievement<
  A extends UserAchievementAttributes = UserAchievementAttributes,
  B extends UserAchievementCreationAttributes = UserAchievementCreationAttributes,
> extends BaseModel<A, B> implements UserAchievementAttributes {

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare userId: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare achievementId: number;

  @Column({
    defaultValue: 0,
    type: DataType.INTEGER,
  })
  declare progress: number;

  @Column({ type: DataType.DATE })
  declare achievedAt?: Date;

}
