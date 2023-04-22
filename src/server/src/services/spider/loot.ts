import { load } from 'cheerio';

import { parseAnyDate } from '../../utils';

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
  timezone?: string;
};

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
    text = '',
    queryFilter = 'h1,h2,h3,h4,h5,h6,p,blockquote',
    dateSelector = 'time',
    dateAttribute = 'datetime',
    timezone,
  }: LootInitProps) {
    this.url = url;
    this.text = text;
    this.queryFilter = queryFilter;
    const $ = load(text);
    this.title = $('title').text();
    const bodyText = $('body').text();
    const dateMatch = parseAnyDate(bodyText, timezone);
    let defaultTimestamp = dateMatch?.valueOf();
    if (Number.isNaN(defaultTimestamp)) {
      defaultTimestamp = undefined;
    }
    const datetext = parseAnyDate($(dateSelector).first().text() ?? '');
    const datetime = parseAnyDate($(dateSelector).attr(dateAttribute) ?? '');
    if (Number.isNaN(datetext.valueOf()) && Number.isNaN(datetime.valueOf())) {
      this.timestamp = defaultTimestamp;
    } else
    if (!Number.isNaN(datetext.valueOf()) && Number.isNaN(datetime.valueOf())) {
      this.timestamp = datetext.valueOf();
    } else
    if (Number.isNaN(datetext.valueOf()) && !Number.isNaN(datetime.valueOf())) {
      this.timestamp = datetime.valueOf();
    } else {
      this.timestamp = datetext.valueOf() > datetime.valueOf() ? datetext.valueOf() : datetime.valueOf();
    }
    if (Number.isNaN(this.timestamp)) {
      this.timestamp = undefined;
    }
    this.filteredText = $(queryFilter).text();
  }

}
