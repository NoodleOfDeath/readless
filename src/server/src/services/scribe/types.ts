import { Publisher } from '../../api/v1/schema';

export type ReadAndSummarizePayload = {
  url: string;
  content?: string;
  outlet?: Publisher; //  -- legacy support
  publisher?: Publisher;
  force?: boolean;
};

export type RecapPayload = {
  start?: string;
  end?: string;
  duration?: string;
  key?: string;
  force?: boolean;
};