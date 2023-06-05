import axios from 'axios';

import { Voucher } from '../../api/v1/schema';
import { BaseService } from '../base';

const APPLE_IAP_ENDPOINT_PROD = 'https://buy.itunes.apple.com/verifyReceipt';
const APPLE_IAP_ENDPOINT_SANDBOX = 'https://sandbox.itunes.apple.com/verifyReceipt';
//const APPLE_IAP_SECRET = process.env.APPLE_IAP_SECRET;

// const GOOGLE_IAP_ENDPOINT = process.env.GOOGLE_IAP_ENDPOINT;
//const GOOGLE_IAP_SECRET = process.env.GOOGLE_IAP_SECRET;

type PurchaseReceipt = {
  packageName: string,
  productId: string,
  purchaseToken: string,
  subscription: true,
};

export type ProcessPurchaseRequestAndroid = {
  platform: 'google';
  receipt: PurchaseReceipt;
};

export type ProcessPurchaseRequestApple = {
  platform: 'apple';
  receipt: string;
};

export type ProcessPurchaseRequest = ProcessPurchaseRequestAndroid | ProcessPurchaseRequestApple;

export type ApplePurchaseResponse = {
  environment: 'Sandbox' | 'Production';
  is_retryable: boolean;
  latest_receipt: string;
  latest_receipt_info: {
    cancellation_date: string;
    cancellation_date_ms: string;
    cancellation_date_pst: string;
    cancellation_reason: string;
    expires_date: string;
    expires_date_ms: string;
    expires_date_pst: string;
    is_in_intro_offer_period: string;
    is_trial_period: string;
    original_purchase_date: string;
    original_purchase_date_ms: string;
    original_purchase_date_pst: string;
    original_transaction_id: string;
    product_id: string;
    promotional_offer_id: string;
    purchase_date: string;
    purchase_date_ms: string;
    purchase_date_pst: string;
    quantity: string;
    subscription_group_identifier: string;
    transaction_id: string;
    web_order_line_item_id: string;
  }[];
  pending_renewal_info: {
    auto_renew_product_id: string;
    auto_renew_status: string;
    expiration_intent: string;
    grace_period_expires_date: string;
    grace_period_expires_date_ms: string;
    grace_period_expires_date_pst: string;
    is_in_billing_retry_period: string;
    original_transaction_id: string;
    price_consent_status: string;
    product_id: string;
  }[];
  receipt: {
    adam_id: number;
    app_item_id: number;
    application_version: string;
    bundle_id: string;
    download_id: number;
    expiration_date: string;
    expiration_date_ms: string;
    expiration_date_pst: string;
    in_app: {
      cancellation_date: string;
      cancellation_date_ms: string;
      cancellation_date_pst: string;
      cancellation_reason: string;
      expires_date: string;
      expires_date_ms: string;
      expires_date_pst: string;
      is_in_intro_offer_period: string;
      is_trial_period: string;
      original_purchase_date: string;
      original_purchase_date_ms: string;
      original_purchase_date_pst: string;
      original_transaction_id: string;
      product_id: string;
      promotional_offer_id: string;
      purchase_date: string;
      purchase_date_ms: string;
      purchase_date_pst: string;
      quantity: string;
      subscription_group_identifier: string;
      transaction_id: string;
      web_order_line_item_id: string;
    }[];
    original_application_version: string;
    original_purchase_date: string;
    original_purchase_date_ms: string;
    original_purchase_date_pst: string;
    preorder_date: string;
    preorder_date_ms: string;
    preorder_date_pst: string;
    receipt_creation_date: string;
    receipt_creation_date_ms: string;
    receipt_creation_date_pst: string;
    receipt_type: string;
    request_date: string;
    request_date_ms: string;
    request_date_pst: string;
    version_external_identifier: number;
  };
  status: number;
};

export class IapService extends BaseService {

  public static async processPurchase(req: ProcessPurchaseRequest) {
    if (req.platform === 'apple') {
      return await this.verifyAppleReceipt(req.receipt);
    }
  }
  
  public static async verifyAppleReceipt(
    receipt: string, 
    endpoint = APPLE_IAP_ENDPOINT_PROD
  ) {
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
    console.log(response.data);
    // Create Voucher
    const voucher = await Voucher.findOne({ where: { id: 0 } });
    return voucher;
  }

  public static async authorizePaywallAccess() {
    return false;
  }
  
}