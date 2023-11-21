import { ReadCount, Streak } from '../../schema';

export type MetricsResponse = {
  streaks: Streak[];
  readCounts?: ReadCount[];
};