import axios from 'axios';

import { BaseService } from '../base';

const APPLE_IAP_ENDPOINT_PROD = 'https://buy.itunes.apple.com/verifyReceipt';
const APPLE_IAP_ENDPOINT_SANDBOX = 'https://sandbox.itunes.apple.com/verifyReceipt';
//const APPLE_IAP_SECRET = process.env.APPLE_IAP_SECRET;

// const GOOGLE_IAP_ENDPOINT = process.env.GOOGLE_IAP_ENDPOINT;
//const GOOGLE_IAP_SECRET = process.env.GOOGLE_IAP_SECRET;

type PurchaseReceipt = string | {
  packageName: string,
  productId: string,
  purchaseToken: string,
  subscription: true,
};

export class IapService extends BaseService {

  public static async processPurchase(platform: string, receipt: PurchaseReceipt) {
    if (platform === 'apple' && typeof receipt === 'string') {
      await this.verifyAppleReceipt(receipt as string);
    }
  }
  
  public static async verifyAppleReceipt(
    receipt: string, 
    endpoint = APPLE_IAP_ENDPOINT_PROD
  ) {
    const data = new FormData();
    data.append('receipt-data', receipt);
    data.append('password', process.env.APPLE_IAP_SECRET);
    data.append('exclude-old-transactions', 'true');
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

  public static async authorizePaywallAccess() {
    return false;
  }
  
}