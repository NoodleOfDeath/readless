import { DatedAttributes } from '../../types';

export type ReferralAttributes = DatedAttributes & {
  /** id of a user if ref link was created while logged in */
  referredById?: number;
  /** the IP address this referral was accessed from */
  remoteAddr: string;
  /** the url path this referral was generated from */
  origin?: string;
  /** the url path of the referral destination */
  target: string;
  /** the user agent info of the consumer of this referral */
  userAgent: string;
  /** geolocation of the referrer */
  geolocation?: string;
};

export type ReferralCreationAttributes = {
  /** id of a user if ref link was created while logged in */
  referredById?: number;
  /** the IP address this referral was accessed from */
  remoteAddr: string;
  /** the url path this referral was generated from */
  origin?: string;
  /** the url path of the referral destination */
  target: string;
  /** the user agent info of the consumer of this referral */
  userAgent: string;
  /** geolocation of the referrer */
  geolocation?: string;
};
