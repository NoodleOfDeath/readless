import { JwtTokenResponse } from '~/api';

export type UserDataProps = {
  userId: number;
  isLoggedIn?: boolean;
  token?: JwtTokenResponse;
  tokens?: JwtTokenResponse | JwtTokenResponse[];
};

export class UserData implements UserDataProps {

  userId: number;
  isLoggedIn?: boolean;
  tokens: JwtTokenResponse[];

  get token() {
    if (this.tokens.length === 0) {
      return undefined;
    }
    return this.tokens[0];
  }

  get tokenString() {
    return this.token?.value;
  }

  get expired() {
    return this.tokens.length > 0 && this.tokens.every((t) => UserData.tokenHasExpired(t));
  }
  
  static tokenHasExpired(token: JwtTokenResponse) {
    return token.expiresAt < Date.now();
  }

  constructor({
    userId, 
    token, 
    tokens = token ? [token] : [],
    isLoggedIn = false, 
  }: UserDataProps) {
    this.userId = userId;
    this.tokens = (Array.isArray(tokens) ? tokens : [tokens]).filter((t) => !UserData.tokenHasExpired(t)).sort((a, b) => b.priority - a.priority);
    this.isLoggedIn = isLoggedIn;
  }
  
  addToken(token: JwtTokenResponse) {
    this.tokens = [...this.tokens, token].filter((t) => !UserData.tokenHasExpired(t)).sort((a, b) => b.priority - a.priority);
  }

}