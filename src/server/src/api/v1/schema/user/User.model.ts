import bcrypt from 'bcryptjs';
import ms from 'ms';
import { Op, QueryTypes } from 'sequelize';
import { Table } from 'sequelize-typescript';

import { INTERACTION_TYPES } from './../resources/interaction/Interaction.types';
import { OpenAIService } from '../../../../services';
import { JWT } from '../../../../services/types';
import { MetricsRequest, MetricsResponse } from '../../controllers/metrics/types';
import { AuthError } from '../../middleware';
import {
  Achievement,
  Alias,
  AliasCreationAttributes,
  AliasPayload,
  AliasType,
  CalculateStreakOptions,
  Credential,
  CredentialCreationAttributes,
  CredentialType,
  DestructuredCredentialPayload,
  FindAliasOptions,
  InteractionCount,
  InteractionType,
  MetadataType,
  Profile,
  QueryFactory,
  RequestLog,
  Role,
  Streak,
  Summary,
  SummaryInteraction,
  ThirdParty,
  UserAchievement,
  UserAchievementCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
  UserEvent,
  UserMetadata,
  UserRole,
  UserStats,
} from '../../schema';
import { BaseModel } from '../base';

@Table({
  modelName: 'user',
  paranoid: true,
  timestamps: true,
})
export class User<A extends UserAttributes = UserAttributes, B extends UserCreationAttributes = UserCreationAttributes>
  extends BaseModel<A, B>
  implements UserAttributes {

  profile?: Profile;
  jwt?: JWT;

  // authentication methods

  /** Resolves a user from an alias request/payload */
  public static async from(payload: AliasPayload, opts?: Partial<FindAliasOptions>) {
    if (payload.userId) {
      const id = payload.userId ?? new JWT(payload.jwt).userId;
      const user = await User.findOne({ where: { id } });
      if (payload.jwt) {
        user.jwt = new JWT(payload.jwt);
      }
      if (!user && !opts?.ignoreIfNotResolved) {
        throw new AuthError('INVALID_CREDENTIALS');
      }
      return user;
    } else {
      const alias = await Alias.from(payload, opts);
      if (!alias) {
        if (!opts?.ignoreIfNotResolved) {
          throw new AuthError('UNKNOWN_ALIAS', { alias: 'email' });
        }
        return undefined;
      }
      const user = await User.findOne({ where: { id: alias.userId } });
      if (payload.jwt) {
        user.jwt = new JWT(payload.jwt);
      }
      return user;
    }
  }

  public static async fromJwt(jwt: AliasPayload | string, opts?: Partial<FindAliasOptions>) {
    return await this.from({ jwt: typeof jwt === 'string' ? jwt : jwt.jwt }, opts);
  }
  
  public async findAlias(type: AliasType) {
    if (type === 'userId') {
      return new Alias({
        type,
        value: `${this.id}`,
        verifiedAt: new Date(),
      });
    }
    return await Alias.findOne({ 
      where: {
        type,
        userId: this.id,
      },
    });
  }
  
  public async findAliases(...types: AliasType[]) {
    if (types.length === 0) {
      return await Alias.findAll({ where: { userId: this.id } });
    }
    return await Alias.findAll({ 
      where: {
        type: { [Op.in]: types },
        userId: this.id,
      },
    });
  }

  public async createAlias<A extends AliasType>(type: A, value: AliasPayload[A], attr: Omit<AliasCreationAttributes, 'type' | 'userId' | 'value'>) {
    return await Alias.create({
      type,
      userId: this.id,
      value: `${value}`,
      ...attr,
    });
  }

  public async generateUsername(): Promise<string> {
    let validUsername = false;
    let alias: Alias | null = null;
    const chatService = new OpenAIService();
    const reply = await chatService.send('Create a very very unique username between 8 and 16 characters long that contains only letters and numbers. And would never be guessed by anyone else.');
    alias = await Alias.findOne({ where: { value: reply } });
    validUsername = alias == null && reply.length > 8 && reply.length < 16 && Boolean(reply.match(/^[a-zA-Z0-9]+$/));
    if (!validUsername) {
      return await this.generateUsername();
    } else {
      await this.createAlias('username', reply, { verifiedAt: new Date() });
    }
    return reply;
  }

  // authorization methods

  public async findCredential(type: CredentialType, value?: string) {
    if (value) {
      return await Credential.findOne({
        where: {
          type,
          userId: this.id,
          value,
        }, 
      });
    }
    return await Credential.findOne({
      where: {
        type,
        userId: this.id,
      }, 
    });
  }
  
  public async findCredentials(type: CredentialType, ...other: CredentialType[]) {
    return await Credential.findAll({
      where: {
        type: { [Op.in]: [type, ...other] },
        userId: this.id,
      }, 
    });
  }

  public async createCredential<C extends CredentialType, V extends C extends 'jwt' ? JWT : string>(type: C, rawValue: V, attr: Omit<CredentialCreationAttributes, 'type' | 'userId' | 'value'> = {}) {
    let value: string;
    let expiresAt: Date;
    if (typeof rawValue === 'string') {
      value = rawValue;
    } else {
      value = rawValue.signed;
      expiresAt = new Date(Date.now() + ms(rawValue.expiresIn));
    }
    if (type === 'password') {
      value = bcrypt.hashSync(value, process.env.PASSWORD_HASH_ROUNDS || 10);
    } else
    if (type === 'otp' || type === 'deleteToken') {
      expiresAt = new Date(Date.now() + ms('15m'));
    }
    return await Credential.create({ 
      expiresAt,
      type,
      userId: this.id,
      value,
      ...attr,
    });
  }

  public async revokeCredential(type: CredentialType, value?: string) {
    if (value) {
      return await Credential.destroy({
        where: {
          type,
          userId: this.id,
          value,
        },
      });
    }
    return await Credential.destroy({
      where: {
        type,
        userId: this.id,
      },
    });
  }
  
  public async authenticate({
    jwt,
    password,
  }: DestructuredCredentialPayload & { jwt?: string }) {
    if (jwt) {
      const token = new JWT(jwt);
      if (token.userId !== this.id) {
        throw new AuthError('INVALID_CREDENTIALS');
      }
      if (token.expired) {
        throw new AuthError('EXPIRED_CREDENTIALS');
      }
    } else
    if (password) {
      const credential = await this.findCredential('password');
      if (!credential) {
        throw new AuthError('INVALID_CREDENTIALS');
      }
      if (!bcrypt.compareSync(password, credential.value)) {
        throw new AuthError('INVALID_PASSWORD');
      }
    } else {
      throw new AuthError('INVALID_CREDENTIALS');
    }
  }
  
  // roles

  public async getRoles() {
    return Object.fromEntries((await Promise.all((await UserRole.findAll({ where: { userId: this.id } })).map(async (role) => (await Role.findOne({ where: { id: role.roleId } })) ))).map((role) => [role.name, role]));
  }
  
  public async highestRole() {
    const roles = Object.values(await this.getRoles());
    if (roles.length === 0) {
      return undefined;
    }
    return roles.sort((a, b) => b.priority - a.priority)[0];
  }
  
  public async hasRole(role: string) {
    return (await this.getRoles())[role] !== undefined;
  }
  
  public async hasScope(scope: string, ...other: string[]) {
    const roles = await this.getRoles();
    return [scope, ...other].every((scope) => Object.values(roles).some((role) => role.scope.includes(scope)));
  }

  public async grantRole(role: string) {
    const roleModel = await Role.findOne({ where: { name: role } });
    if (!roleModel) {
      throw new AuthError('BAD_REQUEST');
    }
    const userRole = await UserRole.findOne({ where: { roleId: roleModel.id, userId: this.id } });
    if (userRole) {
      return roleModel;
    }
    await UserRole.upsert({ roleId: roleModel.id, userId: this.id });
    return roleModel;
  }

  public async revokeRole(role: string) {
    const roleModel = await Role.findOne({ where: { name: role } });
    if (!roleModel) {
      throw new AuthError('BAD_REQUEST');
    }
    const count = await UserRole.destroy({ where: { roleId: roleModel.id, userId: this.id } });
    return count;
  }

  // profile

  public static async getStreaks({ 
    expiresIn = '1h',
    limit = 100,
    userId = null,
  }: CalculateStreakOptions = {}): Promise<Streak[]> {
    const replacements = {
      limit: limit === 'ALL' ? 100 : limit,
      userId, 
    };
    const response: Streak[] = (await User.store.query(QueryFactory.getQuery('streak'), {
      nest: true,
      replacements,
      type: QueryTypes.SELECT,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as UserEvent<{min: string, max: string}>[]).map((e) => ({ 
      end: new Date(e.max),
      expiresSoon: (new Date(new Date().toLocaleDateString()).valueOf() + ms('1d') - new Date(e.updatedAt).valueOf()) < ms(expiresIn),
      length: e.count, 
      start: new Date(e.min),
      userId: e.userId,
      ...e,
    }));
    return response;
  }

  public static async getInteractionCounts(type: InteractionType, req?: MetricsRequest, user?: User): Promise<InteractionCount[]> {
    const replacements = {
      interval: null,
      limit: 100,
      type,
      userId: null,
    };
    const response = (await User.store.query(QueryFactory.getQuery('summary_interaction_count'), {
      nest: true,
      replacements,
      type: QueryTypes.SELECT,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as InteractionCount[]);
    if (user) {
      return response.map((e) => ({ ...e, rank: response.find((r) => r.userId === user.id)?.rank ?? Number.MAX_SAFE_INTEGER }));
    }
    return response;
  }

  public static async getMetrics(user?: User, req?: MetricsRequest): Promise<MetricsResponse> {
    const streaks = await User.getStreaks();
    const readCounts = await User.getInteractionCounts('read', req);
    const shareCounts = await User.getInteractionCounts('share', req);
    return {
      interactionCounts: {
        ...Object.fromEntries(Object.keys(INTERACTION_TYPES).map((type) => [type, []])) as { [key in InteractionType]: [] },
        read: readCounts,
        share: shareCounts,
      },
      streaks,
      userRankings: { 
        interactionCounts: {
          ...Object.fromEntries(Object.keys(INTERACTION_TYPES).map((type) => [type, 0])) as { [key in InteractionType]: number },
          read: readCounts.find((s) => s.userId === user?.id)?.rank ?? Number.MAX_SAFE_INTEGER,
          share: shareCounts.find((s) => s.userId === user?.id)?.rank ?? Number.MAX_SAFE_INTEGER,
        },
        streaks: streaks.find((s) => s.userId === user?.id)?.rank ?? Number.MAX_SAFE_INTEGER,
      },
    };
  }
  
  public async calculateStreak({ 
    longest,
    ...options
  }: CalculateStreakOptions = {}): Promise<Streak> {
    let streak: Streak = {
      end: new Date(new Date().toLocaleDateString()),
      expiresSoon: false,
      length: 1,
      start: new Date(new Date().toLocaleDateString()), 
      updatedAt: new Date(),
      user: (await this.findAlias('username'))?.value,
      userId: this.id,
    };
    const streaks = await User.getStreaks({
      limit: 'ALL', 
      userId: this.id,
      ...options,
    });
    if (!longest) {
      return streaks.find(
        (s) => {
          return (s.end.getFullYear(), s.end.getDate()) === (streak.end.getFullYear(), streak.end.getDate());
        }
      ) ?? streak;
    }
    for (const row of streaks) {
      if (row.length > streak.length) {
        streak = row;
      }
    }
    return streak;
  }
  
  public async calculateLongestStreak() {
    return this.calculateStreak({ longest: true });
  }

  public async getStats(): Promise<UserStats> {
    const lastSeen = (await RequestLog.findOne({ 
      order: [['createdAt', 'desc']], 
      where: { userId: this.id },
    }))?.createdAt;
    const longestStreak = await this.calculateLongestStreak();
    const streak = await this.calculateStreak();
    const achievements = await this.getAchievements();
    const updatedAt = new Date(Math.max(...[longestStreak?.updatedAt, streak?.updatedAt].filter(Boolean).map((d) => d.valueOf())));
    return {
      achievements,
      interactionCounts: {
        read: (await User.getInteractionCounts('read', undefined, this)).find((s) => s.userId === this.id),
        share: (await User.getInteractionCounts('share', undefined, this)).find((s) => s.userId === this.id),
      },
      lastSeen,
      longestStreak,
      memberSince: this.createdAt,
      reputation: achievements.reduce((acc, a) => acc + a.achievement.points ?? 0, 0),
      streak,
      updatedAt: !Number.isNaN(updatedAt.valueOf()) ? updatedAt : new Date(),
    };
  }
  
  public async syncProfile(): Promise<Profile> {
    const profile: Profile = {};
    const aliases = await this.findAliases('email');
    const metadata = await UserMetadata.findAll({ where: { userId: this.id } });
    const updatedAt = new Date(Math.max(...[...aliases, ...metadata].map((m) => m.updatedAt.valueOf())));
    profile.email = aliases.length > 0 ? aliases.sort((a, b) => a.priority - b.priority)[0].value : '',
    profile.emails = aliases.length > 0 ? aliases.map((a) => a.value) : [],
    profile.pendingEmails = aliases.length > 0 ? aliases.filter((a) => a.verifiedAt === null).map((a) => a.value) : [],
    profile.username = (await this.findAlias('username'))?.value,
    profile.linkedThirdPartyAccounts = (await this.findAliases('thirdParty/apple', 'thirdParty/google')).map((a) => a.type.split('/')[1] as ThirdParty);
    profile.preferences = Object.fromEntries(metadata.filter((meta) => meta.type === 'pref').map((meta) => [meta.key, typeof meta.value === 'string' ? JSON.parse(meta.value) : meta.value]));
    profile.createdAt = this.createdAt;
    const stats = await this.getStats();
    profile.updatedAt = new Date(Math.max(updatedAt.valueOf(), stats.updatedAt.valueOf()));
    profile.stats = stats;
    this.set('profile', profile, { raw: true });
    return profile;
  }

  public async setMetadata(
    key: string, 
    value: Record<string, unknown> | string, 
    type: MetadataType = 'pref'
  ) {
    if (await UserMetadata.findOne({ where: { key, userId: this.id } })) {
      await UserMetadata.update({ type, value }, {
        where: {
          key, 
          userId: this.id, 
        },
      });
    } else {
      await UserMetadata.create({
        key, 
        type,
        userId: this.id, 
        value,
      });
    }
  }

  // achievements
  public async getAchievements() {
    return await UserAchievement.findAll({
      include: [Achievement.scope('public')],
      where: { userId: this.id },
    });
  }

  public async hasAchievement(achievement: Achievement) {
    return await UserAchievement.findOne({ 
      include: [Achievement.scope('public')],
      where: { achievementId: achievement.id, userId: this.id },
    });
  }

  public async grantAchievement(achievement: Achievement, { progress = 100, achievedAt = progress === 100 ? new Date() : null }: Partial<UserAchievementCreationAttributes> = {}) {
    if (await this.hasAchievement(achievement)) {
      return achievement;
    }
    return await UserAchievement.create({
      achievedAt,
      achievementId: achievement.id,
      progress, 
      userId: this.id,
    });
  }

  // summary methods
  
  public async destroySummary(targetId: number) {
    if (this.hasRole('god')) {
      await Summary.destroy({ where: { id: targetId } });
    }
    throw new AuthError('INSUFFICIENT_PERMISSIONS');
  }
  
  public async restoreSummary(targetId: number) {
    if (this.hasRole('god')) {
      await Summary.restore({ where: { id: targetId } });
    }
    throw new AuthError('INSUFFICIENT_PERMISSIONS');
  }
  
  public async interactWithSummary(targetId: number, type: InteractionType, remoteAddr?: string, content?: string, metadata?: Record<string, unknown>) {
    const createInteraction = async () => {
      await SummaryInteraction.create({
        content, metadata, remoteAddr, targetId, type, userId: this.id,
      });
    };
    const destroy = !['comment', 'impression', 'share', 'view'].includes(type);
    if (destroy) {
      let searchType = [type];
      if (type === 'downvote' || type === 'upvote') {
        searchType = ['downvote', 'upvote'];
      }
      const interaction = await SummaryInteraction.findOne({
        where: {
          targetId, type: searchType, userId: this.id,
        }, 
      });
      if (interaction) {
        await SummaryInteraction.destroy({
          where: {
            targetId, type: searchType, userId: this.id, 
          },
        });
        const create = ((type === 'downvote' || type === 'upvote') && interaction.type !== type) || type === 'view';
        if (create) {
          await createInteraction();
        }
      } else {
        await createInteraction();
      }
    } else {
      await createInteraction();
    }
    const summary = await Summary.findByPk(targetId);
    return summary;
  }

}
