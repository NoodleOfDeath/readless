import { DatedAttributes } from '../types';

export type UserMetadataAttributes = DatedAttributes & {
  userId: number;
  key: string;
  value: Record<string, unknown>;
};

export type UserMetadataCreationAttributes = {
  userId: number;
  key: string;
  value: Record<string, unknown>;
};