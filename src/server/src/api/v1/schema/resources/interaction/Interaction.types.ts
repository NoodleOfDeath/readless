import { DatedAttributes } from '../../types';

export const INTERACTION_TYPES = {
  bookmark: 'bookmark',
  comment: 'comment',
  copy: 'copy',
  downvote: 'downvote',
  favorite: 'favorite',
  feedback: 'feedback',
  follow: 'follow',
  hide: 'hide',
  listen: 'listen',
  read: 'read',
  search: 'search',
  share: 'share',
  translate: 'translate',
  unfavorite: 'unfavorite',
  unfollow: 'unfollow',
  unhide: 'unhide',
  untranslate: 'untranslate',
  upvote: 'upvote',
  view: 'view',
  vote: 'vote',
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

