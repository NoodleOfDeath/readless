import { DatedAttributes } from '../types';
import { PublicMediaAttributes } from './media/Media.types';

export type PostAttributes = DatedAttributes & {
  title: string;
  text?: string;
  imageUrl?: string;
  media?: PublicMediaAttributes[];
};

export type PostCreationAttributes = Partial<DatedAttributes> & {
  title: string;
  text?: string;
  imageUrl?: string;
  media?: PublicMediaAttributes[];
};

/** light weight record for a post */
export const PUBLIC_POST_ATTRIBUTES = ['id', 'title', 'text', 'imageUrl', 'createdAt'] as const;
/** light weight record for a post with title, category, subcategory, and tags */
