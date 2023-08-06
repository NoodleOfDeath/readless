import admin from 'firebase-admin';

import { BaseService } from '../base';

export type NotifyOptions = {
  data?: any;
  notification: {
    title?: string;
    body?: string;
  }
  tokens: string[];
};

export class FirebaseService extends BaseService {

  // auth

  static client() {
    return admin.initializeApp({ credential: admin.credential.cert(JSON.parse(Buffer.from(process.env.FIREBASE_CREDENTIALS, 'base64').toString('ascii'))) });
  }
  
  static async notify({
    data, notification, tokens, 
  }: NotifyOptions) {
    const messaging = this.client().messaging();
    await messaging.sendMulticast({
      notification,
      tokens,
    });
  }

}