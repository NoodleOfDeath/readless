import axios from 'axios';

import { BaseService } from '../base';

const APPLE_IAP_ENDPOINT_PROD = 'https://buy.itunes.apple.com/verifyReceipt';
const APPLE_IAP_ENDPOINT_SANDBOX = 'https://sandbox.itunes.apple.com/verifyReceipt';
//const APPLE_IAP_SECRET = process.env.APPLE_IAP_SECRET;

const GOOGLE_IAP_ENDPOINT = process.env.GOOGLE_IAP_ENDPOINT;
//const GOOGLE_IAP_SECRET = process.env.GOOGLE_IAP_SECRET;

export class IapService extends BaseService {
  
  public static async authorizePaywallAccess(request?: unknown) {
    return false;
  }
  
  public static async verifyAppleReceipt(
    receipt: unknown, 
    endpoint = APPLE_IAP_ENDPOINT_PROD
  ) {
    const data = new FormData();
    const response = await axios.post(
      endpoint, 
      data, 
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (response.data.status === 21007) {
      return await this.verifyAppleReceipt(receipt, APPLE_IAP_ENDPOINT_SANDBOX);
    }
    return response.data;
  }
  
  public static async verifyGoogleReceipt(receipt: unknown) {
    const data = new FormData();
    const response = await axios.post(
      GOOGLE_IAP_ENDPOINT, 
      data, 
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  }
  
}