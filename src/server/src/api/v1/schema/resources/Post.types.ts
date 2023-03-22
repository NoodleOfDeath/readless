import {
  DatedAttributes,
  InteractionAttributes,
  InteractionType,
} from '../types';

export type Attr<Model, K extends keyof Model> = {
  [Key in K]: Model[Key];
};

export type PostAttributes = DatedAttributes & {
  text: string;
  abridged: string;
  summary: string;
  shortSummary: string;
  bullets: string[];
  imagePrompt: string;
};

export type PostCreationAttributes = {
  text: string;
  abridged: string;
  summary: string;
  shortSummary: string;
  bullets: string[];
  imagePrompt: string;
};

/** light weight record for a post */
export const POST_ATTRS = ['id', 'abridged', 'summary', 'shortSummary', 'bullets', 'createdAt'] as const;
/** light weight record for a post with title, category, subcategory, and tags */

export type PostAttr = Attr<PostAttributes, typeof POST_ATTRS[number]>;

export type TitledCategorizedPostAttributes = PostAttributes & {
  title: string;
  category: string;
  subcategory: string;
  tags: string[];
  interactions: Record<InteractionType, InteractionAttributes[]>
};

export type TitledCategorizedPostCreationAttributes = PostCreationAttributes & {
  title: string;
  category: string;
  subcategory: string;
  tags: string[];
};

export const TITLED_CATEGORIZED_POST_ATTRS = [...POST_ATTRS, 'title', 'category', 'subcategory', 'tags'] as const;
/** light weight record for a source post */

export type TitledCategorizedPostAttr = Attr<TitledCategorizedPostAttributes, typeof TITLED_CATEGORIZED_POST_ATTRS[number]>;