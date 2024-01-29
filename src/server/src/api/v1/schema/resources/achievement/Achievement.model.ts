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
      description: 'Signed up before November 30, 2023 (the 1-year anniversary of ChatGPT). Thanks for being an OG User!',
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
      description: 'Read at least 3 articles',
      displayName: 'Newbie',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('read', { minCount: 3 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      getProgress: async (user) => {
        const interactions = await User.getInteractionCounts('read', undefined, user);
        const count = interactions.find((interaction) => interaction.userId === user.id)?.count ?? 0;
        return count / 3;
      },
      name: 'newbie',
      points: 10,
    },
    {
      description: 'Read at least 10 articles',
      displayName: 'Reader',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('read', { minCount: 10 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      getProgress: async (user) => {
        const interactions = await User.getInteractionCounts('read', undefined, user);
        const count = interactions.find((interaction) => interaction.userId === user.id)?.count ?? 0;
        return count / 10;
      },
      name: 'reader',
      points: 25,
    },
    {
      description: 'Read at least 25 articles',
      displayName: 'Avid Reader',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('read', { minCount: 25 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      getProgress: async (user) => {
        const interactions = await User.getInteractionCounts('read', undefined, user);
        const count = interactions.find((interaction) => interaction.userId === user.id)?.count ?? 0;
        return count / 25;
      },
      name: 'avid-reader',
      points: 50,
    },
    {
      description: 'Read at least 50 articles',
      displayName: 'Page Sage',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('read', { minCount: 50 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      getProgress: async (user) => {
        const interactions = await User.getInteractionCounts('read', undefined, user);
        const count = interactions.find((interaction) => interaction.userId === user.id)?.count ?? 0;
        return count / 50;
      },
      name: 'page-sage',
      points: 75,
    },
    {
      description: 'Read at least 100 articles',
      displayName: 'Century Scribe',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('read', { minCount: 100 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      getProgress: async (user) => {
        const interactions = await User.getInteractionCounts('read', undefined, user);
        const count = interactions.find((interaction) => interaction.userId === user.id)?.count ?? 0;
        return count / 100;
      },
      name: 'century-scribe',
      points: 100,
    },
    {
      description: 'Read at least 300 articles',
      displayName: 'Triple Century Scribe',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('read', { minCount: 100 });
        return await User.findAll({ where : { id: interactions.map(interaction => interaction.userId) } });
      },
      getProgress: async (user) => {
        const interactions = await User.getInteractionCounts('read', undefined, user);
        const count = interactions.find((interaction) => interaction.userId === user.id)?.count ?? 0;
        return count / 100;
      },
      name: 'triple-century-scribe',
      points: 500,
    },
    {
      description: 'Bookmark at least 3 articles',
      displayName: 'Belated Bookworm',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('bookmark', { minCount: 3 });
        return await User.findAll({ where : { id: interactions.map(interaction => interaction.userId) } });
      },
      getProgress: async (user) => {
        const interactions = await User.getInteractionCounts('bookmark', undefined, user);
        const count = interactions.find((interaction) => interaction.userId === user.id)?.count ?? 0;
        return count / 3;
      },
      name: 'belated-bookworm',
      points: 25,
    },
    {
      description: 'Bookmark at least 10 articles',
      displayName: 'Avid Aficionado',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('bookmark', { minCount: 10 });
        return await User.findAll({ where : { id: interactions.map(interaction => interaction.userId) } });
      },
      getProgress: async (user) => {
        const interactions = await User.getInteractionCounts('bookmark', undefined, user);
        const count = interactions.find((interaction) => interaction.userId === user.id)?.count ?? 0;
        return count / 10;
      },
      name: 'avid-aficionado',
      points: 50,
    },
    {
      description: 'Bookmark at least 30 articles',
      displayName: 'Insatiable Inquirer',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('bookmark', { minCount: 30 });
        return await User.findAll({ where : { id: interactions.map(interaction => interaction.userId) } });
      },
      getProgress: async (user) => {
        const interactions = await User.getInteractionCounts('bookmark', undefined, user);
        const count = interactions.find((interaction) => interaction.userId === user.id)?.count ?? 0;
        return count / 30;
      },
      name: 'insatiable-inquirer',
      points: 250,
    },
    {
      description: 'Bookmark at least 100 articles',
      displayName: 'Highlight Honcho',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('bookmark', { minCount: 100 });
        return await User.findAll({ where : { id: interactions.map(interaction => interaction.userId) } });
      },
      getProgress: async (user) => {
        const interactions = await User.getInteractionCounts('bookmark', undefined, user);
        const count = interactions.find((interaction) => interaction.userId === user.id)?.count ?? 0;
        return count / 100;
      },
      name: 'highlight-honcho',
      points: 1000,
    },
    {
      description: 'Share at least 3 articles',
      displayName: 'Advocate',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('share', { minCount: 3 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      getProgress: async (user) => {
        const interactions = await User.getInteractionCounts('share', undefined, user);
        const count = interactions.find((interaction) => interaction.userId === user.id)?.count ?? 0;
        return count / 3;
      },
      name: 'advocate',
      points: 25,
    },
    {
      description: 'Share at least 10 articles',
      displayName: 'Community Catalyst',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('share', { minCount: 10 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      getProgress: async (user) => {
        const interactions = await User.getInteractionCounts('share', undefined, user);
        const count = interactions.find((interaction) => interaction.userId === user.id)?.count ?? 0;
        return count / 10;
      },
      name: 'community-catalyst',
      points: 50,
    },
    {
      description: 'Share at least 30 articles',
      displayName: 'Pioneering Patron',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('share', { minCount: 30 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      getProgress: async (user) => {
        const interactions = await User.getInteractionCounts('share', undefined, user);
        const count = interactions.find((interaction) => interaction.userId === user.id)?.count ?? 0;
        return count / 30;
      },
      name: 'pioneering-patron',
      points: 250,
    },
    {
      description: 'Share at least 100 articles',
      displayName: 'Dissemination Deity',
      findCandidates: async () => {
        const interactions = await User.getInteractionCounts('share', { minCount: 100 });
        return await User.findAll({ where : { id : interactions.map(interaction => interaction.userId) } });
      },
      getProgress: async (user) => {
        const interactions = await User.getInteractionCounts('share', undefined, user);
        const count = interactions.find((interaction) => interaction.userId === user.id)?.count ?? 0;
        return count / 100;
      },
      name: 'dissemination-deity',
      points: 500,
    },
    {
      description: 'Have at least one streak of 3 days or more',
      displayName: 'Streaker',
      findCandidates: async () => {
        const streaks = await User.getStreaks({ minCount: 3 });
        return await User.findAll({ where : { id : streaks.map((streak) => streak.userId) } });
      },
      getProgress: async (user) => {
        const longestStreak = await user.calculateLongestStreak();
        return (longestStreak?.length ?? 0) / 3;
      },
      name: 'streaker',
      points: 10,
    },
    {
      description: 'Have at least one streak of 7 days or more',
      displayName: 'Stweeker',
      findCandidates: async () => {
        const interactions = await User.getStreaks({ minCount: 7 });
        return await User.findAll({ where : { id : interactions.map((streak) => streak.userId) } });
      },
      getProgress: async (user) => {
        const longestStreak = await user.calculateLongestStreak();
        return (longestStreak?.length ?? 0) / 7;
      },
      name: 'stweeker',
      points: 25,
    },
    {
      description: 'Have at least one streak of 14 days or more',
      displayName: 'Double Stweeker',
      findCandidates: async () => {
        const streaks = await User.getStreaks({ minCount: 14 });
        return await User.findAll({ where : { id : streaks.map((streak) => streak.userId) } });
      },
      getProgress: async (user) => {
        const longestStreak = await user.calculateLongestStreak();
        return (longestStreak?.length ?? 0) / 14;
      },
      name: 'double-stweeker',
      points: 50,
    },
    {
      description: 'Have at least one streak of 21 days or more',
      displayName: 'Triple Stweeker',
      findCandidates: async () => {
        const streaks = await User.getStreaks({ minCount: 21 });
        return await User.findAll({ where : { id : streaks.map((streak) => streak.userId) } });
      },
      getProgress: async (user) => {
        const longestStreak = await user.calculateLongestStreak();
        return (longestStreak?.length ?? 0) / 21;
      },
      name: 'triple-stweeker',
      points: 75,
    },
    {
      description: 'Have at least one streak of 30 days or more',
      displayName: 'Monthly Master',
      findCandidates: async () => {
        const streaks = await User.getStreaks({ minCount: 30 });
        return await User.findAll({ where : { id : streaks.map((streak) => streak.userId) } });
      },
      getProgress: async (user) => {
        const longestStreak = await user.calculateLongestStreak();
        return (longestStreak?.length ?? 0) / 30;
      },
      name: 'monthly-master',
      points: 100,
    },
    {
      description: 'Have at least one streak of 60 days or more',
      displayName: 'Double Monthly Master',
      findCandidates: async () => {
        const streaks = await User.getStreaks({ minCount: 60 });
        return await User.findAll({ where : { id : streaks.map((streak) => streak.userId) } });
      },
      getProgress: async (user) => {
        const longestStreak = await user.calculateLongestStreak();
        return (longestStreak?.length ?? 0) / 60;
      },
      name: 'monthly-master-2x',
      points: 500,
    },
    {
      description: 'Have at least one streak of 90 days or more',
      displayName: 'Triple Monthly Master',
      findCandidates: async () => {
        const streaks = await User.getStreaks({ minCount: 90 });
        return await User.findAll({ where : { id : streaks.map((streak) => streak.userId) } });
      },
      getProgress: async (user) => {
        const longestStreak = await user.calculateLongestStreak();
        return (longestStreak?.length ?? 0) / 90;
      },
      name: 'triple-monthly-master',
      points: 2000,
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