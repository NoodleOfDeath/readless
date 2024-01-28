import { DatedAttributes } from '../../types';

export type InteractionType =
  | 'bookmark'
  | 'comment'
  | 'copy'
  | 'downvote'
  | 'favorite'
  | 'feedback'
  | 'follow'
  | 'hide'
  | 'listen'
  | 'read'
  | 'search'
  | 'share'
  | 'translate'
  | 'upvote'
  | 'view'
  | 'vote';

export type InteractionAttributes = DatedAttributes & {
  /** user that made this interaction **/
  userId?: number;
  /** ip address of the user that made this interaction */
  remoteAddr?: string;
  /** id of the target of this interaction */
  targetId: number;
  /** type of this interaction */
  type: InteractionType;
  /** true if the interaction was a reversion */
  revert: boolean;
  /** value associated with the interaction */
  content?: string;
  metadata?: Record<string, unknown>;
};

export type InteractionCreationAttributes = {
  userId?: number;
  remoteAddr?: string;
  targetId: number;
  type: InteractionType;
  revert?: boolean;
  content?: string;
  metadata?: Record<string, unknown>;
};

