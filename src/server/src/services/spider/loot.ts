import { HTMLElement, parse } from 'node-html-parser';

export type LootProps = {
  url: string;
  timestamp: number;
  text?: string;
  queryFilter?: string;
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
  queryFilter?: string;
  root?: HTMLElement;
  title?: string;
  nodes?: HTMLElement[];
  json?: Record<string, unknown>[];

  get nodeText() {
    return this.nodes?.map((node) => node.rawText) ?? [];
  }

  get filteredText() {
    return this.nodeText.filter((text) => text.replace(/^[\s\n]*$/g, '').length > 0).join('\n');
  }

  get asPromptData() {
    return JSON.stringify(
      {
        url: this.url,
        timestamp: this.timestamp,
        title: this.title,
        filteredText: this.filteredText,
      },
      null,
      2,
    );
  }

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
    this.nodes = root.querySelectorAll(queryFilter);
    this.json = root.querySelectorAll("script[type='application/json']").map((e) => JSON.parse(e.rawText)) as Record<
      string,
      unknown
    >[];
  }
}
