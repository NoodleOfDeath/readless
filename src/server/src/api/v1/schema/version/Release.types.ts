import { DatedAttributes } from '../types';

export const PLATFORMS = {
  android: 'android',
  ios: 'ios',
  web: 'web,',
} as const;

export type Platform = typeof PLATFORMS[keyof typeof PLATFORMS];

export type ReleaseAttributes = DatedAttributes & {
  platform: Platform;
  version: string;
  description?: string;
};

export type ReleaseCreationAttributes = {
  platform: Platform;
  version: string;
  description?: string;
};