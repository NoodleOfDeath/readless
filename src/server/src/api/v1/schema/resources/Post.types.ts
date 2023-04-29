import { InteractionResponse } from '../interaction/Interaction.types';
import { DatedAttributes } from '../types';

export type Attr<Model, K extends keyof Model> = {
  [Key in K]: Model[Key];
};

export const RESOURCE_TYPES = {
  outlet: 'outlet',
  summary: 'summary',
} as const;

export type ResourceType = typeof RESOURCE_TYPES[keyof typeof RESOURCE_TYPES];

export type PostAttributes = DatedAttributes & {
  title: string;
  text?: string;
  imageUrl?: string;
  interactions?: InteractionResponse;
};

export type PostCreationAttributes = {
  title: string;
  text?: string;
  imageUrl?: string;
};

/** light weight record for a post */
export const PUBLIC_POST_ATTRIBUTES = ['id', 'title', 'text', 'imageUrl', 'createdAt'] as const;
/** light weight record for a post with title, category, subcategory, and tags */
