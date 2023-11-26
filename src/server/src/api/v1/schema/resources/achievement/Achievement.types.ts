import {
  Attributes,
  FindOptions,
  Model,
} from 'sequelize';

import { RequestLog } from '../../models';
import { DatedAttributes } from '../../types';

export type AchievementCriteriaMetric = 'count' | 'time';

export type AchievementCriteria<T extends Model = RequestLog> = Partial<FindOptions<Attributes<T>>> & {
  table: string;
};

export type AchievementAttributes = DatedAttributes & {
  name: string;
  criteria?: AchievementCriteria;
  description?: string;
  displayName?: string;
  points?: number;
};

export type AchievementCreationAttributes = Partial<DatedAttributes> & {
  name: string;
  criteria?: AchievementCriteria;
  description?: string;
  displayName?: string;
  points?: number;
};