import { DatedAttributes } from '../types';

export type MetadataAttributes<Key extends string, Group extends string> = DatedAttributes & {
  parentId: number;
  key: Key;
  group?: Group;
  value: Record<string, unknown> | string;
};

export type MetadataCreationAttributes<Key extends string, Group extends string> = Partial<DatedAttributes> & {
  parentId: number;
  key: Key;
  group?: Group;
  value: Record<string, unknown> | string;
};