export type ReadAndSummarizeOptions = {
  onProgress?: (progress: number) => void;
  force?: boolean;
  outletId?: number;
};

export type ReadAndSummarizePayload = {
  url: string;
};