import { OAuth2Client } from 'google-auth-library';

import { BaseService } from '../base';

type GoogleServiceOptions = {
  clientId?: string;
  clientSecret?: string;
}

export class GoogleService extends BaseService {

  clientId: string;
  client: OAuth2Client;
  
  constructor({ 
    clientId = process.env.GOOGLE_CLIENT_ID,
    clientSecret = process.env.GOOGLE_CLIENT_SECRET,
  }: GoogleServiceOptions = {}) {
    super();
    this.clientId = clientId;
    this.client = new OAuth2Client({
      clientId,
      clientSecret,
    });
  }
  
  async verify(accessToken: string) {
    return await this.client.verifyIdToken({
      audience: this.clientId,
      idToken: accessToken,
    });
  }

}