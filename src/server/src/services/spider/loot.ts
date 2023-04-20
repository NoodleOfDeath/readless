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
    text,
    queryFilter = 'h1,h2,h3,h4,h5,h6,p,blockquote',
    dateSelector = 'time',
    dateAttribute = 'datetime',
  }: LootInitProps) {
    this.url = url;
    this.text = text;
    this.queryFilter = queryFilter;
    const $ = load(text);
    this.title = $('title').text();
    const bodyText = $('body').text();
    const dateMatch = parseAnyDate(bodyText);
    let defaultTimestamp = dateMatch?.valueOf();
    if (Number.isNaN(defaultTimestamp)) {
      defaultTimestamp = undefined;
    }
    const datetext = new Date($(dateSelector).first().text());
    const datetime = new Date($(dateSelector).attr(dateAttribute));
    if (Number.isNaN(datetext) && Number.isNaN(datetime)) {
      this.timestamp = defaultTimestamp;
    } else
    if (!Number.isNaN(datetext) && Number.isNaN(datetime)) {
      this.timestamp = datetext.valueOf();
    } else
    if (Number.isNaN(datetext) && !Number.isNaN(datetime)) {
      this.timestamp = datetime.valueOf();
    } else {
      this.timestamp = datetext.valueOf() > datetime.valueOf() ? datetext.valueOf() : datetime.valueOf();
    }
    this.filteredText = $(queryFilter).text();
  }

}
