import ms from 'ms';
import { PublisherCreationAttributes, SpiderSelector } from 'src/api/v1/schema';

type ReplacePattern = RegExp | string | {
  expr: RegExp | string,
  repl: string,
};

export type UrlOptions = {
  publisher: PublisherCreationAttributes;
  spider?: SpiderSelector;
  baseUrl?: string;
  targetUrl?: string;
  excludeExternal?: boolean;
  removeQuery?: boolean;
};

export function replaceDatePlaceholders(
  url: string
) {
  return url.replace(/\$\{(.*?)(?:(-?\d\d?)|\+(\d\d?))?\}/g, ($0, $1, $2, $3) => {
    const offset = Number($2 ?? 0) + Number($3 ?? 0);
    switch ($1) {
    case 'YYYY':
      return new Date(Date.now() + offset * ms('1y'))
        .getFullYear()
        .toString();
    case 'M':
      return (((new Date().getMonth() + offset) % 12) + 1).toString();
    case 'MM':
      return (((new Date().getMonth() + offset) % 12) + 1)
        .toString()
        .padStart(2, '0');
    case 'MMMM':
      return new Date(`2050-${((new Date().getMonth() + offset) % 12) + 1}-01`).toLocaleString('default', { month: 'long' });
    case 'D':
      return new Date(Date.now() + offset * ms('1d')).getDate().toString();
    case 'DD':
      return new Date(Date.now() + offset * ms('1d'))
        .getDate()
        .toString()
        .padStart(2, '0');
    default:
      return $0;
    }
  });
}

export function fixRelativeUrl(url: string, {
  publisher,
  targetUrl = publisher.baseUrl,
  excludeExternal,
  removeQuery,
}: UrlOptions) {
  const { baseUrl } = publisher;
  const domain = new URL(baseUrl).hostname.replace(/^www\./, '');
  const domainExpr = new RegExp(`^https?://(?:www\\.)?${domain}`);
  const baseDomain = `https://${new URL(targetUrl).hostname.replace(/\/*$/, '')}`;
  if (removeQuery) {
    url = url.replace(/\?.*$/, '');
  }
  // fix relative hrefs
  if (/^\/\//.test(url)) {
    return `https:${url}`;
  } else
  if (/^\//.test(url)) {
    return `${baseDomain}${url}`;
  } else
  if (/^\.\//.test(url)) {
    return `${targetUrl.replace(/\/.*?$/, '')}${url.replace(/^\./, '')}`;
  } else
  if (excludeExternal && /^https?:\/\//.test(url)) {
    // exclude external links
    if (!domainExpr.test(url)) {
      return '';
    }
  }
  return url;
}
  
export function parseSrcset(str: string, options: UrlOptions) {
  const splitSet = (srcset: string) => {
    const [path = '', widthStr = ''] = srcset.split(/\s+/);
    const widthSubstr = widthStr.replace(/[wx]/ig, '');
    const width = Number.isNaN(Number(widthSubstr)) ? undefined : Number(widthSubstr);
    if (path && width) {
      const url = fixRelativeUrl(path, options).replace(/\s+.*$/, '');
      return { url, width };
    }
  };
  if (/\S+\s+\d+[wx]\s*,/i.test(str)) {
    return str.split(/\s*,\s*/)
      .map((url) => splitSet(url))
      .filter(Boolean)
      .sort((a, b) => b.width - a.width)
      .map((img) => img.url)
      .filter(Boolean);
  } else
  if (/^\s*\S+\s+\d+[wx]\s*$/i.test(str)) {
    return [splitSet(str).url].filter(Boolean);
  }
  return [fixRelativeUrl(str, options)].filter(Boolean);
}
    
export function clean(text?: string, ...patterns: ReplacePattern[]) {
  let newText = (text ?? '')
    .replace(/\s\s+/g, ' ')
    .replace(/\t\t+/g, '\t')
    .replace(/\n\n+/g, '\n');
  for (const pattern of patterns) {
    if (typeof pattern === 'string' || pattern instanceof RegExp) {
      newText = newText.replace(pattern, '');
    } else {
      newText = newText.replace(pattern.expr, pattern.repl);
    }
  }
  return newText.trim();
}