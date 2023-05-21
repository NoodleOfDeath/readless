import { v2 } from '@google-cloud/translate';
import { OAuth2Client } from 'google-auth-library';

import { BaseService } from '../base';

export class GoogleService extends BaseService {

  static get credentials() {
    return JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS, 'base64').toString('ascii'));
  }

  static translate: v2.Translate = new v2.Translate({ credentials: this.credentials });
  
  static async verify(accessToken: string) {
    return await (new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })).verifyIdToken({
      audience:  process.env.GOOGLE_CLIENT_ID,
      idToken: accessToken,
    });
  }
  
  static async getLanguages() {
    const [languages] = await this.translate.getLanguages();
    return languages;
  }
    
  static async translateText(text: string, target: string) {
    const [resp] = await this.translate.translate(text, target);
    if (!resp) {
      return undefined;
    }
    const translations = Array.isArray(resp) ? resp : [resp];
    const bestTranslation = translations[0];
    return bestTranslation as string;
  }

}