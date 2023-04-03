import jwt from 'jsonwebtoken';

import { LoginResponse } from '~/api';

export type UserDataProps = {
  userId: number;
  isLoggedIn?: boolean;
  token?: LoginResponse['token'];
  tokens?: LoginResponse['token'] | LoginResponse['token'][];
};

export class UserData implements UserDataProps {

  userId: number;
  isLoggedIn?: boolean;
  tokens: LoginResponse['token'][];

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
    return this.tokens.length > 0 && this.tokens.every((t) => UserData.tokenHasExpired(t.value));
  }
  
  static tokenHasExpired(tokenString: string) {
    const token = jwt.decode(tokenString);
    if (!token || typeof token === 'string' || !token.exp) {
      return true;
    }
    return token.exp < Date.now() / 1_000;
  }

  constructor({
    userId, 
    token, 
    tokens = token ? [token] : [],
    isLoggedIn = false, 
  }: UserDataProps) {
    this.userId = userId;
    this.tokens = (Array.isArray(tokens) ? tokens : [tokens]).filter((t) => !UserData.tokenHasExpired(t.value)).sort((a, b) => b.priority - a.priority);
    this.isLoggedIn = isLoggedIn;
  }
  
  addToken(token: LoginResponse['token']) {
    this.tokens = [...this.tokens, token].filter((t) => !UserData.tokenHasExpired(t.value)).sort((a, b) => b.priority - a.priority);
  }

}