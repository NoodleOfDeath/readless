import { DatedAttributes } from '../../types';

export type SystemLogLevel = 'error' | 'info' | 'warning';

export type NotifyOptions = {
  email?: string;
  html?: string;
  text?: string;
  subject?: string;
};

export type SystemLogAttributes = DatedAttributes & {
  level: SystemLogLevel;
  message: string;
};

export type SystemLogCreationAttributes = {
  level: SystemLogLevel;
  message: string;
  notify?: NotifyOptions;
};