import axios from 'axios';
import jwt from 'jsonwebtoken';

import { PurchaseRequest, PurchaseResponse } from './types';
import { BaseService } from '../base';

const APPLE_IAP_ENDPOINT_PROD = 'https://buy.itunes.apple.com/verifyReceipt';
const APPLE_IAP_ENDPOINT_SANDBOX = 'https://sandbox.itunes.apple.com/verifyReceipt';

// const GOOGLE_IAP_ENDPOINT = process.env.GOOGLE_IAP_ENDPOINT;
//const GOOGLE_IAP_SECRET = process.env.GOOGLE_IAP_SECRET;

export class IapService extends BaseService {

  public static async processPurchase(req: PurchaseRequest) {
    if (req.platform === 'apple') {
      return await this.verifyAppleReceipt(req.receipt);
    }
  }
  
  public static async verifyAppleReceipt(
    receipt: string, 
    endpoint = APPLE_IAP_ENDPOINT_PROD
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const response = await axios.post(
      endpoint, 
      {
        'exclude-old-transactions': 'true',
        password: process.env.APPLE_IAP_SECRET,
        'receipt-data': receipt,
      }, 
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (response.data.status === 21007) {
      return await this.verifyAppleReceipt(receipt, APPLE_IAP_ENDPOINT_SANDBOX);
    }
    const purchase = new PurchaseResponse('apple', response.data);
    if (purchase.expiresAt < new Date()) {
      throw new Error('Expired receipt');
    }
    // await IapVoucher.upsert(purchase);
    // return await IapVoucher.scope('public').findOne({
    //   where: 
    //   { uuid: purchase.uuid },
    // });
  }

  public static async validateSubscription(token: string) {
    const { uuid, vendor } = jwt.verify(token, process.env.JWT_SECRET) as { uuid: string, vendor: 'apple' | 'google' };
    console.log(uuid, vendor);
  }
  
}