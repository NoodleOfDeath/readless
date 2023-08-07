import admin from 'firebase-admin';

export type FirebaseMessage = {
  notification: {
    title: string;
    body: string;
  };
  token: string;
};

import { BaseService } from '../base';

export class FirebaseService extends BaseService {

  // auth

  static client() {
    return admin.initializeApp({ credential: admin.credential.cert(JSON.parse(Buffer.from(process.env.FIREBASE_CREDENTIALS, 'base64').toString('ascii'))) });
  }
  
  static async notify(messages: FirebaseMessage[]) {
    const messaging = this.client().messaging();
    await messaging.sendEach(messages);
  }

}