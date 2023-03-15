import { google } from 'googleapis';
import {
  Credentials, LoginTicket, OAuth2Client 
} from 'google-auth-library';

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
      idToken: accessToken,
      audience: this.clientId,
    });
  }
  
  async getProfile(ticket: LoginTicket, credentials: Credentials) {
    // Get the user's Google ID
    const userId = ticket.getPayload().sub;
    // Set the credentials to the client
    this.client.setCredentials(credentials);
    // Get the Gmail API instance
    const gmail = google.gmail({ version: 'v1', auth: this.client });
    // Get the user's email
    const profile = await gmail.users.getProfile({ userId });
    return profile.data;
  }

}