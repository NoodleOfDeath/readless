import { Outlet } from '../../api/v1/schema';

export type ReadAndSummarizePayload = {
  url: string;
  content?: string;
  outlet?: Outlet;
  force?: boolean;
};