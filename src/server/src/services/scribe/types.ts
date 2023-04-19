export type ReadAndSummarizePayload = {
  url: string;
  content?: string;
  dateSelector?: string;
  dateAttribute?: string;
  onProgress?: (progress: number) => void;
  force?: boolean;
  outletId?: number;
};