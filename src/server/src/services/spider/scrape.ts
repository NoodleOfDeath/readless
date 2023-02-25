/**
 * All types and constants defined in this
 * docment were derived from https://docs.webscrapingapi.com/webscrapingapi/getting-started/api-parameters
 * Last Updated: 2023-02-24
 */

export const WS_API = 'https://api.webscrapingapi.com';

export const COUNTRY_CODES = {
  AU: 'Australia',
  CA: 'Canada',
  CH: 'China',
  FR: 'France',
  GM: 'Germany',
  JP: 'Japan',
  MX: 'Mexico',
  SP: 'Spain',
  UK: 'United Kingdom',
  US: 'United States',
} as const;

export type Device = 'desktop' | 'mobile' | 'tablet';
export type ProxyType = 'datacenter' | 'residential';
export type CountryCode = keyof typeof COUNTRY_CODES;
export type Country = typeof COUNTRY_CODES[CountryCode];
export type WaitForCSS = string;

export type ScreenshotOptions =
  | { width: number; height: number }
  | { full_page: boolean }
  | { screenshot_selector: string }
  | { return_html: boolean };

export type ExtractRule = {
  selector: string;
  output?: 'text' | 'html';
};

export type JSInstructions = {};
export type BlockableResources = string;

export type ScrapeOpts = {
  api_key: string;
  device?: Device;
  proxy_type?: ProxyType;
  render_js?: boolean;
  stealth_mode?: boolean;
  country?: CountryCode;
  timeout?: number;
  wait_until?: string;
  wait_for?: number;
  wait_for_css?: WaitForCSS;
  window_width?: number;
  window_height?: number;
  screenshot?: boolean;
  screenshot_options?: ScreenshotOptions;
  extract_rules?: Record<string, ExtractRule>;
  json_response?: boolean;
  js_dom?: boolean;
  js_instructions?: JSInstructions;
  disable_stealth?: boolean;
  block_resources?: BlockableResources;
  block_ads?: boolean;
  block_trackers?: boolean;
  session?: boolean;
  keep_headers?: boolean;
  return_page_source?: boolean;
};

/**
 * stringifies and url encodes any object to meet the WebscrapingAPI expectations.
 * i.e. booleans are converted into 0s or 1s
 */
export function encodeScrapeOpts<T>(opts: Partial<T>) {
  return new URLSearchParams(
    Object.fromEntries(
      Object.entries(opts)
        .filter(([_, value]) => !!value)
        .map(([key, value]) => [
          key,
          typeof value === 'string'
            ? value
            : typeof value === 'boolean'
            ? JSON.stringify(Boolean(value))
            : JSON.stringify(value),
        ]),
    ),
  );
}

/**
 * a response type expected from webscrapingapi
 * based on the extract rules passed
 */
export type ScrapeResponse<T extends ScrapeOpts['extract_rules']> = {
  [Key in keyof T]: string[];
};

/**
 * convenience class for handling scrape responses
 */
export class ScrapeLoot<T extends ScrapeOpts['extract_rules']> {
  resp: ScrapeResponse<T>;

  constructor(resp: ScrapeResponse<T>) {
    this.resp = resp;
  }

  collapsed() {
    return Object.fromEntries(Object.entries(this.resp).map(([key, value]) => [key, value.join('\n')])) as {
      [Key in keyof T]: string;
    };
  }
}
