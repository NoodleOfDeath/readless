// record management
import { SupportedLocale } from '../../../core/locales';

// custom headers
export enum CustomHeader {
  LOCALE = 'x-locale',
  PLATFORM = 'x-platform',
  USER_ID = 'x-user-id',
  UUID = 'x-uuid',
  VERSION = 'x-version',
}

// bulk response models

export type BulkResponse<T> = {
  count: number;
  next?: number;
  rows: T[];
};

export type BulkMetadataResponse<T, M> = BulkResponse<T> & {
  metadata?: M;
};

// TODO: Clean Up

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
  locale: SupportedLocale;
}; 

export type TtsRequest = JobRequest & {
  voice?: string;
};

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
