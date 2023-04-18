import { load } from 'cheerio';

export type LootProps = {
  url: string;
  timestamp: number;
  text?: string;
  queryFilter?: string;
  title?: string;
  tags?: string[];
  categories?: string[];
};

export type LootInitProps = Omit<LootProps, 'timestamp'> & {
  timestamp?: number;
  dateSelector?: string;
};

export class Loot implements LootProps {

  url: string;
  timestamp: number;
  text: string;
  filteredText?: string;
  queryFilter?: string;
  title?: string;
  tags?: string[];
  categories?: string[];

  constructor({
    url,
    timestamp = Date.now(),
    text,
    queryFilter = 'h1,h2,h3,h4,h5,h6,p,blockquote',
    dateSelector,
  }: LootInitProps) {
    this.url = url;
    this.text = text;
    this.queryFilter = queryFilter;
    const $ = load(text);
    this.title = $('title').text();
    this.timestamp = dateSelector ? new Date($(dateSelector).text()).valueOf() || timestamp : timestamp;
    this.filteredText = $(queryFilter).text();
  }

}
