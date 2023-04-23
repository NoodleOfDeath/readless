import { DatedAttributes } from '../../types';

export type FetchPolicy = {
  count: number;
  window: number;
};

export type Selector = {
  selector: string;
  ignore?: string[];
  attribute?: string;
};

export type Selectors = {
  article: Selector;
  author: Selector;
  date: Selector;
  spider: Selector;
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
  siteMaps?: string[];
  /** fetch policy for this outlet */
  fetchPolicy?: FetchPolicy;
  timezone?: string;
};

export type OutletCreationAttributes = {
  baseUrl: string;
  name: string;
  displayName: string;
  brandImageUrl?: string;
  description?: string;
  selectors: Selectors;
  siteMaps?: string[];
  fetchPolicy?: FetchPolicy;
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
};