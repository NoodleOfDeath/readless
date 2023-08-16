import { Publisher } from '../../api/v1/schema';

export type ReadAndSummarizePayload = {
  url: string;
  content?: string;
  publisher?: Publisher;
  force?: boolean;
  priority?: bigint;
};

export type RecapPayload = {
  start?: string;
  end?: string;
  duration?: string;
  key?: string;
  force?: boolean;
};