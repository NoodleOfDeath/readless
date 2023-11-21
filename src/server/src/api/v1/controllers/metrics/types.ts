import {
  InteractionCount,
  InteractionType,
  Streak,
} from '../../schema';

export type Metrics = {
  streaks: Streak[];
  interactionCounts: Record<InteractionType, InteractionCount[]>;
};

export type MetricType = keyof Metrics;

export type MetricsRequest = {
  after?: Date;
  before?: Date;
};

export type MetricsResponse = Metrics & {
  userRankings?: {
    streaks: number;
    interactionCounts: Record<InteractionType, number>;
  };
};