import { load } from 'cheerio';

export type LootProps = {
  url: string;
  timestamp?: number;
  text?: string;
  queryFilter?: string;
  title?: string;
  tags?: string[];
  categories?: string[];
};

export type LootInitProps = Omit<LootProps, 'timestamp'> & {
  dateSelector?: string;
  dateAttribute?: string;
};

const DATE_EXPR = /((?:\d{1,2}\/\d{1,2}\/)|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?[,\s]\s*)\d{4}(?:,?\s+\d{1,2}:\d{1,2}(?:\s*(?:am|pm))?)?(?:\s+ET|EST|UDT)?/i;

export class Loot implements LootProps {

  url: string;
  text: string;
  timestamp?: number;
  filteredText?: string;
  queryFilter?: string;
  title?: string;
  tags?: string[];
  categories?: string[];

  constructor({
    url,
    text,
    queryFilter = 'h1,h2,h3,h4,h5,h6,p,blockquote',
    dateSelector = 'time,div[aria-label="Published"]',
    dateAttribute = 'datetime,aria-label',
  }: LootInitProps) {
    this.url = url;
    this.text = text;
    this.queryFilter = queryFilter;
    const $ = load(text);
    this.title = $('title').text();
    const bodyText = $('body').text();
    const dateMatch = bodyText.match(DATE_EXPR)?.[0].replace(/([ECMP])T$/, ($0, $1) => `${$1}ST`).replace('AK', 'AST');
    let defaultTimestamp = DATE_EXPR.test(bodyText) ? new Date(dateMatch).valueOf() : undefined;
    if (Number.isNaN(defaultTimestamp)) {
      defaultTimestamp = undefined;
    }
    this.timestamp = dateSelector ? new Date(dateAttribute ? $(dateSelector).attr(dateAttribute) || $(dateSelector).text() : $(dateSelector).text()).valueOf() || defaultTimestamp : defaultTimestamp;
    this.filteredText = $(queryFilter).text();
  }

}
