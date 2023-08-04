import admin from 'firebase-admin';

import { BaseService } from '../base';

export class FirebaseService extends BaseService {

  // auth

  static client() {
    return admin.initializeApp({ credential: admin.credential.cert(JSON.parse(Buffer.from(process.env.FIREBASE_CREDENTIALS, 'base64').toString('ascii'))) });
  }

}