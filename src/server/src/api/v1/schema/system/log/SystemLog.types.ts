import { DatedAttributes } from '../../types';

export type SystemLogLevel = 'error' | 'info' | 'warning';

export type SystemLogAttributes = DatedAttributes & {
  level: SystemLogLevel;
  message: string;
};

export type SystemLogCreationAttributes = {
  level: SystemLogLevel;
  message: string;
};