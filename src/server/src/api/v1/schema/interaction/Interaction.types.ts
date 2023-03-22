import { ValuesOfKeys } from '../../../../types';
import { DatedAttributes } from '../types';

export const INTERACTION_TYPES = {
  bookmark: 'bookmark',
  comment: 'comment',
  impression: 'impression',
  like: 'like',
  share: 'share',
  view: 'view',
} as const;

export type InteractionType = ValuesOfKeys<typeof INTERACTION_TYPES>;

export type InteractionValue<T extends InteractionType> = T extends 'like' ? (-1 | 0 | 1) : string;

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
  actorId: number;
  type: InteractionType;
  value?: string;
};

export type InteractionRequest = {
  userId: number;
  value?: string;
};

export type InteractionResponse = {
  id: number;
};