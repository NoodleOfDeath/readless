import { HTMLElement, parse } from 'node-html-parser';

export type LootProps = {
  url: string;
  timestamp: number;
  text?: string;
  queryFilter?: string;
  root?: HTMLElement;
  title?: string;
  nodes?: HTMLElement[];
  tags?: string[];
  categories?: string[];
};

export type LootInitProps = Omit<LootProps, 'timestamp'> & { timestamp?: number };

export class Loot implements LootProps {
  url: string;
  timestamp: number;
  text: string;
  filteredText?: string;
  queryFilter?: string;
  root?: HTMLElement;
  title?: string;
  nodes?: HTMLElement[];
  tags?: string[];
  categories?: string[];

  constructor({
    url,
    timestamp = Date.now(),
    text,
    queryFilter = 'h1,h2,h3,h4,h5,h6,p,blockquote',
    root = parse(text),
  }: LootInitProps) {
    this.url = url;
    this.timestamp = timestamp;
    this.text = text;
    this.queryFilter = queryFilter;
    this.root = root;
    this.title = root.querySelector('title').rawText;
    const nodes = root.querySelectorAll(queryFilter);
    this.filteredText = (nodes?.map((node) => node.rawText) ?? [])
      .filter((text) => text.replace(/^[\s\n]*$/g, '').length > 0)
      .join('\n');
  }
}
