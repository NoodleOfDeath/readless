import jwt from 'jsonwebtoken';

type PurchaseReceipt = {
  packageName: string,
  productId: string,
  purchaseToken: string,
  subscription: true,
};

export type PurchaseRequestAndroid = {
  platform: 'google';
  receipt: PurchaseReceipt;
};

export type PurchaseRequestApple = {
  platform: 'apple';
  receipt: string;
};

export type PurchaseRequest = PurchaseRequestAndroid | PurchaseRequestApple;

export type ApplePurchaseResponse = {
  environment: 'Production' | 'Sandbox';
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
    original_transid: string;
    product_id: string;
    promotional_offer_id: string;
    purchase_date: string;
    purchase_date_ms: string;
    purchase_date_pst: string;
    quantity: string;
    subscription_group_identifier: string;
    transid: string;
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
    original_transid: string;
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
      original_transid: string;
      product_id: string;
      promotional_offer_id: string;
      purchase_date: string;
      purchase_date_ms: string;
      purchase_date_pst: string;
      quantity: string;
      subscription_group_identifier: string;
      transid: string;
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

const JWT_TOKEN_LIFESPAN = '1d';

export class PurchaseResponse<
  V extends string, 
  R = V extends 'apple' ? ApplePurchaseResponse : V extends 'google' ? object : never
> {
  
  uuid: string;
  vendor: V;
  productId: string;
  data: string;
  expiresAt: Date;
  token: string;
  
  constructor(vendor: V, purchase: R) {
    if (vendor === 'apple') {
      const receipt = (purchase as ApplePurchaseResponse).latest_receipt_info[0];
      if (!receipt) {
        throw new Error('Invalid receipt');
      }
      this.uuid = receipt.original_transid;
      this.vendor = vendor;
      this.productId = receipt.product_id;
      this.data = JSON.stringify(purchase);
      this.expiresAt = new Date(Number(receipt.expires_date_ms));
      this.token = jwt.sign({
        productId: receipt.product_id,
        uuid: receipt.original_transid,
        vendor,
      }, process.env.JWT_SECRET, { expiresIn: JWT_TOKEN_LIFESPAN });
    } else
    if (vendor === 'google') {
      throw new Error('Not implemented');
    } else {
      throw new Error('Invalid vendor');
    }
  }
  
}
