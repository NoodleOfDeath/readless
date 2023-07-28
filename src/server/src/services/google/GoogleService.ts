import os from 'os';

import { v2 } from '@google-cloud/translate';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

import { BaseService } from '../base';

export const GOOGLE_MP_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
export const GOOGLE_MP_DEBUG_ENDPOINT = 'https://www.google-analytics.com/debug/mp/collect';

export type MPCollectEvent = {
  name: string;
  params: {
    [key: string]: string;
  }
};

export type MPCollectPayload = {
  debug?: boolean;
  measurement_id?: string;
  api_secret?: string;
  client_id?: string;
  events: MPCollectEvent[];
};

export class GoogleService extends BaseService {

  // auth

  static client() {
    return new v2.Translate({ credentials: JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS, 'base64').toString('ascii')) }); 
  }
  
  static async verify(accessToken: string) {
    return await (new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })).verifyIdToken({
      audience:  process.env.GOOGLE_CLIENT_ID,
      idToken: accessToken,
    });
  }
  
  // translations

  static async getLanguages() {
    const [languages] = await this.client().getLanguages();
    return languages;
  }
    
  static async translateText(text: string, target: string) {
    console.log('translating', text, 'to', target);
    const [resp] = await this.client().translate(text, target);
    if (!resp) {
      return undefined;
    }
    const translations = Array.isArray(resp) ? resp : [resp];
    const bestTranslation = translations[0];
    return bestTranslation as string;
  }

  // analytics

  static async collectMetric({
    debug,
    measurement_id = process.env.GOOGLE_MEASUREMENT_ID,
    api_secret = process.env.GOOGLE_MEASUREMENT_API_SECRET,
    client_id = process.env.GOOGLE_MEASUREMENT_CLIENT_ID || os.hostname(),
    events,
  }: MPCollectPayload) {
    const resp = await axios.post(`${debug ? GOOGLE_MP_DEBUG_ENDPOINT : GOOGLE_MP_ENDPOINT}?measurement_id=${measurement_id}&api_secret=${api_secret}`, {
      client_id,
      events,
    }, { headers: { 'Content-Type': 'application/json' } });
    return resp;
  }

}