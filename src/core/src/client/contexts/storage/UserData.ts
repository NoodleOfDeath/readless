import {
  LoginResponse,
  Profile,
  WrappedJwt,
} from '~/api';

export type UserDataProps = LoginResponse & {
  tokens?: WrappedJwt | WrappedJwt[];
};

export class UserData implements UserDataProps {

  userId: number;
  tokens: WrappedJwt[] = [];
  profile?: Profile;

  get token() {
    if (this.tokens.length === 0) {
      return undefined;
    }
    return this.tokens[0];
  }

  get tokenString() {
    return this.token?.signed;
  }

  get expired() {
    return this.tokens.length > 0 && this.tokens.every((t) => UserData.tokenHasExpired(t));
  }
  
  static tokenHasExpired(token: WrappedJwt) {
    return token.expiresAt < Date.now();
  }

  constructor({
    userId, 
    token, 
    tokens = token ? [token] : [],
    profile,
  }: UserDataProps) {
    this.userId = userId;
    this.tokens = (Array.isArray(tokens) ? tokens : [tokens]).filter((t) => !UserData.tokenHasExpired(t)).sort((a, b) => b.priority - a.priority);
    this.profile = profile;
  }
  
  addToken(token: WrappedJwt) {
    this.tokens = [...this.tokens, token].filter((t) => !UserData.tokenHasExpired(t)).sort((a, b) => b.priority - a.priority);
  }

}