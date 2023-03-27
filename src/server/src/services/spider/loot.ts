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
  }: LootInitProps) {
    this.url = url;
    this.timestamp = timestamp;
    this.text = text;
    this.queryFilter = queryFilter;
    const $ = load(text);
    this.title = $('title').text();
    this.filteredText = $(queryFilter).text();
  }

}
