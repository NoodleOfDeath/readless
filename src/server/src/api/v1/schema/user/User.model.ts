import bcrypt from 'bcryptjs';
import ms from 'ms';
import { Op, QueryTypes } from 'sequelize';
import { Table } from 'sequelize-typescript';

import { JWT } from '../../../../services/types';
import { AuthError } from '../../middleware';
import {
  Alias,
  AliasCreationAttributes,
  AliasPayload,
  AliasType,
  Credential,
  CredentialCreationAttributes,
  CredentialType,
  DestructuredCredentialPayload,
  FindAliasOptions,
  InteractionType,
  MetadataType,
  Profile,
  QueryFactory,
  RefUserRole,
  RequestLog,
  Role,
  Streak,
  Summary,
  SummaryInteraction,
  ThirdParty,
  UserAttributes,
  UserCreationAttributes,
  UserEventRaw,
  UserMetadata,
  UserStats,
  rawUserEventMap,
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
    if (payload.userId || opts?.jwt) {
      const id = payload.userId ?? new JWT(opts.jwt).userId;
      const user = await User.findOne({ where: { id } });
      if (opts.jwt) {
        user.jwt = new JWT(opts.jwt);
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
      if (opts?.jwt) {
        user.jwt = new JWT(opts.jwt);
      }
      return user;
    }
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
    return Object.fromEntries((await Promise.all((await RefUserRole.findAll({ where: { userId: this.id } })).map(async (role) => (await Role.findOne({ where: { id: role.roleId } })) ))).map((role) => [role.name, role]));
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
    await RefUserRole.create({ roleId: roleModel.id, userId: this.id });
    return roleModel;
  }

  public async revokeRole(role: string) {
    const roleModel = await Role.findOne({ where: { name: role } });
    if (!roleModel) {
      throw new AuthError('BAD_REQUEST');
    }
    const count = await RefUserRole.destroy({ where: { roleId: roleModel.id, userId: this.id } });
    return count;
  }

  // profile

  public static async getStreaks(): Promise<Streak[]> {
    const replacements = { noUserId: true };
    const response = (await User.store.query(QueryFactory.getQuery('streak'), {
      nest: true,
      replacements,
      type: QueryTypes.SELECT,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as UserEventRaw[]).map(rawUserEventMap);
    return response;
  }
  
  public async getProfileBase(): Promise<Profile> {
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
    profile.updatedAt = updatedAt;
    return profile;
  }
  
  public async calculateStreak(longest = false): Promise<Streak> {
    const replacements = {
      noUserId: false,
      userId: this.id,
    };
    const response = (await User.store.query(QueryFactory.getQuery('streak'), {
      nest: true,
      replacements,
      type: QueryTypes.SELECT,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as UserEventRaw[]).map(rawUserEventMap);
    let streak: Streak = {
      end: new Date(new Date().toLocaleDateString()),
      length: 0, 
      start: new Date(new Date().toLocaleDateString()), 
    };
    if (!longest) {
      return response.find(
        (s) => {
          console.log(s.end, s.end.getDate(), new Date().toLocaleDateString());
          return (s.end.getFullYear(), s.end.getDate()) === (streak.end.getFullYear(), streak.end.getDate());
        }
      ) ?? streak;
    }
    for (const row of response) {
      if (row.length > streak.length) {
        streak = row;
      }
    }
    return streak;
  }
  
  public async calculateLongestStreak() {
    return this.calculateStreak(true);
  }

  public async getStats(): Promise<UserStats> {
    const lastSeen = (await RequestLog.findOne({ 
      order: [['createdAt', 'desc']], 
      where: { userId: this.id },
    }))?.createdAt;
    const longestStreak = await this.calculateLongestStreak();
    const streak = await this.calculateStreak();
    return {
      lastSeen,
      longestStreak,
      streak,
    };
  }
  
  public async syncProfile() {
    // fetch profile
    const profile = await this.getProfileBase();
    profile.stats = await this.getStats();
    this.set('profile', profile, { raw: true });
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
