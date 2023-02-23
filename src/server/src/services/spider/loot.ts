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
  tags?: string[];
  categories?: string[];
};

export type LootInitProps = Omit<LootProps, 'timestamp'> & { timestamp?: number };

function jsonFilter(obj: unknown, key: string) {
  const matches = [];
  if (obj !== null && typeof obj === 'object') {
    if (Object.keys(obj).includes(key)) {
      matches.push(obj[key]);
    }
    for (const subkey of Object.keys(obj)) {
      matches.push(...jsonFilter(obj[subkey] as Record<string, unknown>, key));
    }
  }
  return matches;
}

const OUTLET_FILTERS = {
  'www.bustle.com': (json: Record<string, unknown>[]): Partial<LootProps> => {
    const sections = jsonFilter(json, 'sections');
    const bodyZones = jsonFilter(json, 'bodyZones');
    const tags = jsonFilter(json, 'tags').map((tag) => tag['slug'] as string);
    const categories = jsonFilter(json, 'categoryConnection')
      .map((category) => jsonFilter(category, 'nodes').map((node) => node['slug'] as string))
      .flat();
    const text = [
      sections
        .map((section) => {
          const matches = JSON.stringify(section).matchAll(/"(.*?)"/g);
          return Array.from(matches)
            .map((match) => match[1])
            .filter((match) => match !== 'p' && match.length > 0)
            .join('');
        })
        .join('\n')
        .replace(/”/g, '"')
        .replace(/’/g, "'"),
      bodyZones.map((bodyZone) => jsonFilter(bodyZone, 'oembed').map((o) => o.title)).join('\n'),
    ].join('\n');
    return {
      text,
      tags,
      categories,
    };
  },
  'www.nytimes.com': (json: Record<string, unknown>[]) => {
    return {};
  },
};

export class Loot implements LootProps {
  url: string;
  timestamp: number;
  text: string;
  filteredText?: string;
  queryFilter?: string;
  root?: HTMLElement;
  title?: string;
  nodes?: HTMLElement[];
  json?: Record<string, unknown>[];
  tags?: string[];
  categories?: string[];

  get nodeText() {
    return this.nodes?.map((node) => node.rawText) ?? [];
  }

  get scrape() {
    this.json.map((j) => {});
    return {
      title: this.title,
      text: this.filteredText,
      json: this.json,
    };
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
    this.json = root
      .querySelectorAll("script[type='application/json'],script[type='application/ld+json']")
      .map((e) => JSON.parse(e.rawText)) as Record<string, unknown>[];
    const baseUrl = new URL(url).origin.replace(/^https?:\/\//, '');
    const outletFilter = OUTLET_FILTERS[baseUrl];
    if (outletFilter) {
      const { text, tags, categories } = outletFilter(this.json);
      if (text) this.filteredText = text;
      if (tags) this.tags = tags;
      if (categories) this.categories = categories;
    } else {
      this.filteredText = this.nodeText.filter((text) => text.replace(/^[\s\n]*$/g, '').length > 0).join('\n');
    }
  }
}
