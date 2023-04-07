import { InteractionResponse } from './../interaction/Interaction.types';
import { DatedAttributes } from '../types';

export type Attr<Model, K extends keyof Model> = {
  [Key in K]: Model[Key];
};

export const RESOURCE_TYPES = {
  article: 'article',
  interaction: 'interaction',
  media: 'media',
  outlet: 'outlet',
  summary: 'summary',
} as const;

export type ResourceType = typeof RESOURCE_TYPES[keyof typeof RESOURCE_TYPES];

export const READING_FORMATS = {
  bullets: 'bullets',
  casual: 'casual',
  concise: 'concise',
  detailed: 'detailed',
  inDepth: 'in-depth',
} as const;

export type ReadingFormat = typeof READING_FORMATS[keyof typeof READING_FORMATS];

export type PostAttributes = DatedAttributes & {
  text: string;
  longSummary: string;
  summary: string;
  shortSummary: string;
  bullets: string[];
  imagePrompt: string;
  interactions: InteractionResponse;
  formats: ReadingFormat[];
};

export type PostCreationAttributes = {
  text: string;
  longSummary: string;
  summary: string;
  shortSummary: string;
  bullets: string[];
  imagePrompt: string;
};

/** light weight record for a post */
export const POST_ATTRS = ['id', 'longSummary', 'summary', 'shortSummary', 'bullets', 'createdAt'] as const;
/** light weight record for a post with title, category, subcategory, and tags */

export type TitledCategorizedPostAttributes = PostAttributes & {
  title: string;
  category: string;
  subcategory: string;
  tags: string[];
};

export type TitledCategorizedPostCreationAttributes = PostCreationAttributes & {
  title: string;
  category: string;
  subcategory: string;
  tags: string[];
};

export const TITLED_CATEGORIZED_POST_ATTRS = [...POST_ATTRS, 'title', 'category', 'subcategory', 'tags'] as const;