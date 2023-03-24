import { ValuesOfKeys } from '../../../../types';
import { DatedAttributes } from '../types';

export const MEDIA_TYPES = {
  audio: 'audio',
  document: 'document',
  image: 'image',
  video: 'video',
} as const;

export type MediaType = ValuesOfKeys<typeof MEDIA_TYPES>;

export type MediaAttributes = DatedAttributes & {
  /** type of this media */
  type: MediaType;
  /** foreign key of the resource this media belongs to **/
  parentId: number;
  /** base url of this media */
  url: string;
};

export type MediaCreationAttributes = {
  type: MediaType;
  parentId: number;
  url: string;
};