// record management

export type BulkResponse<T> = {
  count: number;
  rows: T[];
};

export type BulkMetadataResponse<T, M> = BulkResponse<T> & {
  metadata?: M;
};

export type DestroyResponse = {
  success: boolean;
};

// services

export type PendingJobResponse = {
  ticket: string;
};

export type JobRequest = {
  resourceType: string;
  resourceId: number;
};

export type LocalizeRequest = JobRequest & {
  /** target locale **/
  locale: string;
}; 

export type TtsRequest = JobRequest;

// interactions

export type InteractionRequest = {
  userId?: number;
  remoteAddr?: string;
  content?: string;
  metadata?: Record<string, unknown>;
};

export type InteractionUserVote = 'up' | 'down';

// uh this type exists? forcing rebuild
export type InteractionResponse = {
  bookmark: number;
  userBookmarked?: boolean;
  favorite: number;
  userFavorited?: boolean;
  comment: number;
  downvote: number;
  listen: number;
  read: number;
  share: number;
  upvote: number;
  uservote?: InteractionUserVote;
  view: number;
};
