import { Op, fn } from 'sequelize';
import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';

import { AchievementAttributes, AchievementCreationAttributes } from './Achievement.types';
import { BaseModel } from '../../base';
import { RequestLog, User } from '../../models';

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

  @Column({ type: DataType.TEXT })
  declare description?: string;

  @Column({ type: DataType.STRING })
  declare displayName?: string;

  @Column({ type: DataType.INTEGER })
  declare points?: number;

  static ACHIEVEMENT_CRITERIA: AchievementCreationAttributes[] = [
    {
      beforeDateBased: new Date('11/30/2023'),
      description: 'This achievement is given only to users who signed up before November 30, 2023 (the 1-year anniversary of ChatGPT). Thanks for being an OG USer!',
      displayName: 'OG',
      findCandidates: async () => {
        const logs = await RequestLog.findAll({
          attributes: [
            'userId', [fn('min', 'createdAt'), 'createdAt'],
          ],
          group: ['userId'],
          where: { 
            createdAt: { [Op.lte]: new Date('11/30/2023') }, 
            userId: { [Op.ne]: null }, 
          },
        });
        return await User.findAll({ where : { id : logs.map(log => log.userId) } });
      },
      name: 'og-user',
      points: 500,
    },
    {
      description: 'This achievement is given to users who have read at least 3 articles',
      displayName: 'Newbie',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('read', { minCount: 3 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      name: 'newbie',
      points: 10,
    },
    {
      description: 'This achievement is given to users who have read at least 10 articles',
      displayName: 'Reader',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('read', { minCount: 10 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      name: 'reader',
      points: 25,
    },
    {
      description: 'This achievement is given to users who have read at least 25 articles',
      displayName: 'Bookworm',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('read', { minCount: 25 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      name: 'bookworm',
      points: 50,
    },
    {
      description: 'This achievement is given to users who have at least one streak of 3 days or more',
      displayName: 'Streaker',
      findCandidates: async () => {
        const interactions = await User.getStreaks({ minCount: 3 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      name: 'streaker',
      points: 10,
    },
    {
      description: 'This achievement is given to users who have at least one streak of 7 days or more',
      displayName: 'Stweeker',
      findCandidates: async () => {
        const interactions = await User.getStreaks({ minCount: 7 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      name: 'stweeker',
      points: 25,
    },
    {
      description: 'This achievement is given to users who have at least one streak of 14 days or more',
      displayName: 'Double Stweeker',
      findCandidates: async () => {
        const interactions = await User.getStreaks({ minCount: 14 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      name: 'double-stweeker',
      points: 50,
    },
  ];

  static async prepare() {
    for (const achievement of this.ACHIEVEMENT_CRITERIA) {
      const exists = await this.findOne({ where: { name: achievement.name } });
      if (exists) {
        this.update(achievement, { where: { name: achievement.name } });
      } else {
        this.create(achievement);
      }
    }
  }

}