
import { DatedAttributes } from '../types';

export type MetricAttributes = DatedAttributes & {
  type: 'click' | 'nav';
  data: Record<string, unknown>;
  /** ip address(es) of actor */
  referrer?: string[];
  /** the user agent info of the consumer of this referral */
  userAgent: string;
};

export type MetricCreationAttributes = MetricAttributes;