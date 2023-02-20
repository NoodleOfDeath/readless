import { HTMLElement, parse } from 'node-html-parser';

export type LootProps = {
  url: string;
  timestamp: number;
  text?: string;
  contentFilter?: string;
  root?: HTMLElement;
  title?: string;
  nodes?: HTMLElement[];
  json?: Record<string, unknown>[];
};

export type LootInitProps = Omit<LootProps, 'timestamp'> & { timestamp?: number };

export class Loot implements LootProps {
  url: string;
  timestamp: number;
  text: string;
  contentFilter?: string;
  root?: HTMLElement;
  title?: string;
  nodes?: HTMLElement[];
  json?: Record<string, unknown>[];

  get rawText() {
    return this.nodes?.map((node) => node.rawText) ?? [];
  }

  constructor({
    url,
    timestamp = Date.now(),
    text,
    contentFilter = 'h1,h2,h3,h4,h5,h6,p,blockquote',
    root,
  }: LootInitProps) {
    this.url = url;
    this.timestamp = timestamp;
    this.text = text;
    this.contentFilter = contentFilter;
    this.root = root ?? parse(text);
    this.title = root.querySelector('title').rawText;
    this.nodes = root.querySelectorAll(contentFilter);
    this.json = root.querySelectorAll("script[type='application/json']").map((e) => JSON.parse(e.rawText)) as Record<
      string,
      unknown
    >[];
  }
}
