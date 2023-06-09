import axios from 'axios';
import jwt from 'jsonwebtoken';

import { PurchaseRequest, PurchaseResponse } from './types';
import { PublicVoucherAttributes, Voucher } from '../../api/v1/schema';
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
  ): Promise<PublicVoucherAttributes> {
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
    // Create Voucher
    const voucher = await Voucher.scope('public').findOne({
      where: 
      { uuid: purchase.uuid },
    });
    if (voucher) {
      return {
        ...voucher.toJSON(),
        expired: voucher.expired,
      };
    }
    await Voucher.create(purchase);
    return await Voucher.scope('public').findOne({
      where: 
      { uuid: purchase.uuid },
    });
  }

  public static async validateSubscription(token: string) {
    const { uuid, vendor } = jwt.verify(token, process.env.JWT_SECRET) as { uuid: string, vendor: 'apple' | 'google' };
    const voucher = await Voucher.findOne({
      where: 
      { uuid },
    });
    if (!voucher) {
      throw new Error('Invalid voucher');
    }
    if (voucher.vendor !== vendor) {
      throw new Error('Invalid vendor');
    }
    if (voucher.expired) {
      throw new Error('Expired voucher');
    }
    return voucher;
  }
  
}