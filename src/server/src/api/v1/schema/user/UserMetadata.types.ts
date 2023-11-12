import { DatedAttributes } from '../types';

export type UserMetadataAttributes = DatedAttributes & {
  userId: number;
  key: string;
  value: Record<string, unknown> | string;
};

export type UserMetadataCreationAttributes = {
  userId: number;
  key: string;
  value: Record<string, unknown> | string;
};