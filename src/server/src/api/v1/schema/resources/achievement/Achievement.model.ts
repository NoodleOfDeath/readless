import { Op, fn } from 'sequelize';
import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';

import {
  AchievementAttributes,
  AchievementCreationAttributes,
  AchievementCriteria,
} from './Achievement.types';
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

  @Index({ unique: true })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare name: string;

  @Column({ type: DataType.JSON })
  declare criteria?: AchievementCriteria;

  @Column({ type: DataType.TEXT })
  declare description?: string;

  @Column({ type: DataType.STRING })
  declare displayName?: string;

  @Column({ type: DataType.INTEGER })
  declare points?: number;

  static ACHIEVEMENTS: AchievementCreationAttributes[] = [
    {
      criteria: {
        attributes: [
          'userId', [fn('min', 'createdAt'), 'createdAt'],
        ],
        group: ['userId'],
        table: 'RequestLog',
        where: { 
          createdAt: { [Op.lte]: new Date('11/20/2023') }, 
          userId: { [Op.ne]: null }, 
        },
      },
      description: 'This achievement is given only to users who signed up before November 30, 2023 (the 1-year anniversary of ChatGPT). Thanks for being an OG USer!',
      displayName: 'OG',
      name: 'og-user',
      points: 500,
    },
  ];

  static async prepare() {
    for (const achievement of this.ACHIEVEMENTS) {
      const exists = await this.findOne({ where: { name: achievement.name } });
      if (exists) {
        this.update(achievement, { where: { name: achievement.name } });
      } else {
        this.create(achievement);
      }
    }
  }

  get parsedCriteria(): AchievementCriteria {
    if (!this.criteria) {
      return undefined;
    }
    return Object.keys(this.criteria).reduce((prev, curr) => { 
      let next = this[curr as keyof AchievementCriteria];
      if (Array.isArray(next)) {
        next = next.map((n) => typeof n === 'object' && n.fn && n.args ? fn(n.fn, n.args) : n);
      }
      return {
        ...prev, 
        [curr]: next,
      };
    }, {}) as AchievementCriteria;
  }

}