import { Outlet } from '../../api/v1/schema';

export type ReadAndSummarizePayload = {
  url: string;
  content?: string;
  outlet?: Outlet;
  force?: boolean;
};

export type RecapPayload = {
  lookback?: string;
  start?: string;
  end?: string;
  key?: string;
  force?: boolean;
};