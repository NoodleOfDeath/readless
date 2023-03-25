import { DatedAttributes } from '../types';

export const INTERACTION_TYPES = {
  bookmark: 'bookmark',
  comment: 'comment',
  downvote: 'downvote',
  impression: 'impression',
  share: 'share',
  upvote: 'upvote',
  view: 'view',
} as const;

export type InteractionType = typeof INTERACTION_TYPES[keyof typeof INTERACTION_TYPES];

export type InteractionAttributes = DatedAttributes & {
  /** user that made this interaction **/
  userId: number;
  /** id of the target of this interaction */
  targetId: number;
  /** type of this interaction */
  type: InteractionType;
  /** value associated with the interaction */
  value?: string;
};

export type InteractionCreationAttributes = {
  userId: number;
  targetId: number;
  type: InteractionType;
  value?: string;
};

export type InteractionRequest = {
  userId: number;
  value?: string;
};

export type InteractionResponse = {
  [key in InteractionType]: number;
};