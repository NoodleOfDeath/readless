import { DatedAttributes } from '../../types';

export type SiteMapParams = string | string[][];

export type SiteMap = {
  /**
   * Template url for retrieving news articles
   * Can contain template options such as:
   * YYYY = 4-digit year (current)
   * YY = 2-digit year (current)
   * MMMM = month name (current)
   * MM = 2-digit month (current)
   * M = 1/2-digit month (current)
   * DD = 2-digit day (current)
   * D = 1/2 digit day (current)
   * $1, $2, ... = param1, param2, ...
   */
  url: string;
  /** template params to dynamically interpolate */
  params?: SiteMapParams;
  /** keep query string */
  keepQuery?: boolean;
  /** css selector(s) for getting news links */
  selector: string;
  /** attribute to extract from retrieved html nodes; if nothing is specified the element's `innerHTML` is used */
  attribute?: 'href' | 'src';
  dateSelector?: string;
  dateAttribute?: string;
};

export type FetchPolicy = {
  count: number;
  window: number;
};

export type OutletAttributes = DatedAttributes & {
  /** name of this outlet */
  name: string;
  /** xml site maps for this outlet and selector for extracting urls */
  displayName: string;
  brandImageUrl?: string;
  description?: string;
  siteMaps: SiteMap[];
  /** fetch policy for this outlet */
  fetchPolicy?: FetchPolicy;
};

export type OutletCreationAttributes = {
  name: string;
  displayName: string;
  brandImageUrl?: string;
  description?: string;
  siteMaps: SiteMap[];
  fetchPolicy?: FetchPolicy;
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