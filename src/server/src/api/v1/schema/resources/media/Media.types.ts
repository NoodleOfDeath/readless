import { DatedAttributes } from '../../types';

export type MediaType =
  | 'audio' 
  | 'image'
  | 'video';

export type MediaAttributes = DatedAttributes & {
  parentId: number;
  key: string;
  path: string;
  type: MediaType;
  url?: string;
};

export type MediaCreationAttributes = Partial<DatedAttributes> & {
  parentId: number;
  key: string;
  path: string;
  type: MediaType;
  url?: string;
};

export const PUBLIC_MEDIA_ATTRIBUTES = ['key', 'path', 'type', 'url'];

export type PublicMediaAttributes = {
  key: string;
  path: string;
  type: MediaType;
  url?: string;
};