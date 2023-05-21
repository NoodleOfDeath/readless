import { DatedAttributes } from '../types';

export type PostAttributes = DatedAttributes & {
  title: string;
  text?: string;
  imageUrl?: string;
};

export type PostCreationAttributes = Partial<DatedAttributes> & {
  title: string;
  text?: string;
  imageUrl?: string;
};

/** light weight record for a post */
export const PUBLIC_POST_ATTRIBUTES = ['id', 'title', 'text', 'imageUrl', 'createdAt'] as const;
/** light weight record for a post with title, category, subcategory, and tags */
