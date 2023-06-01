import { DatedAttributes } from '../../types';

export type MediaType =
  | 'audio' 
  | 'image'
  | 'video';

export type MediaAttributes = DatedAttributes & {
  parentId: number;
  key: string;
  type: MediaType;
  url?: string;
  content?: string;
};

export type MediaCreationAttributes = Partial<DatedAttributes> & {
  parentId: number;
  key: string;
  type: MediaType;
  url?: string;
  content?: string;
};

export const PUBLIC_MEDIA_ATTRIBUTES = ['key', 'type', 'url'];

export type PublicMediaAttributes = {
  key: string;
  type: MediaType;
  url?: string;
  content?: string;
};