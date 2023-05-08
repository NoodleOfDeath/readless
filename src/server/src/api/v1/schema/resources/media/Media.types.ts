import { DatedAttributes } from '../../types';

export type MediaType =
  | 'audio' 
  | 'image'
  | 'translation'
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