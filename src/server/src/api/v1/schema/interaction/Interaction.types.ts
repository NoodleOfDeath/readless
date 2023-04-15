import { DatedAttributes } from '../types';

export const INTERACTION_TYPES = {
  bookmark: 'bookmark',
  comment: 'comment',
  copy: 'copy',
  downvote: 'downvote',
  favorite: 'favorite',
  feedback: 'feedback',
  listen: 'listen',
  read: 'read',
  share: 'share',
  upvote: 'upvote',
  view: 'view',
} as const;

export type InteractionType = typeof INTERACTION_TYPES[keyof typeof INTERACTION_TYPES];

export type InteractionAttributes = DatedAttributes & {
  /** user that made this interaction **/
  userId?: number;
  /** ip address of the user that made this interaction */
  remoteAddr?: string;
  /** id of the target of this interaction */
  targetId: number;
  /** type of this interaction */
  type: InteractionType;
  /** value associated with the interaction */
  content?: string;
  metadata?: Record<string, unknown>;
};

export type InteractionCreationAttributes = {
  userId?: number;
  remoteAddr?: string;
  targetId: number;
  type: InteractionType;
  content?: string;
  metadata?: Record<string, unknown>;
};

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
