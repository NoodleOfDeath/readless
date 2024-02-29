import { DatedAttributes } from '../types';

export type MetadataType = 'info' | 'pref' | 'stat';

export type UserMetadataAttributes = DatedAttributes & {
  userId: number;
  key: string;
  value: Record<string, unknown> | string;
  type: MetadataType;
};

export type UserMetadataCreationAttributes = {
  userId: number;
  key: string;
  value: Record<string, unknown> | string;
  type?: MetadataType;
};