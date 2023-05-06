import { DatedAttributes } from '../../types';
import { SentimentAttributes } from '../sentiment/Sentiment.types';

export type FetchPolicy = {
  limit: number;
  window: string;
};

export type Selector = {
  selector: string;
  exclude?: string[];
  attribute?: string;
};

export type Selectors = {
  article: Selector;
  author: Selector;
  date: Selector;
  spider: Selector;
  image?: Selector;
  title?: Selector;
};

export type OutletAttributes = DatedAttributes & {
  baseUrl: string;
  /** name of this outlet */
  name: string;
  /** xml site maps for this outlet and selector for extracting urls */
  displayName: string;
  brandImageUrl?: string;
  description?: string;
  selectors: Selectors;
  maxAge: string;
  /** fetch policy for this outlet */
  fetchPolicy?: Record<string, FetchPolicy>;
  timezone: string;
};

export type OutletCreationAttributes = {
  baseUrl: string;
  name: string;
  displayName: string;
  brandImageUrl?: string;
  description?: string;
  selectors: Selectors;
  maxAge?: string;
  fetchPolicy?: Record<string, FetchPolicy>;
  timezone?: string;
};

export const PUBLIC_OUTLET_ATTRIBUTES = [
  'id',
  'name',
  'displayName',
  'brandImageUrl',
  'description',
] as const;

export type PublicOutletAttributes = {
  id: number;
  name: string;
  displayName: string;
  brandImageUrl?: string;
  description?: string;
  sentiment?: SentimentAttributes;
};