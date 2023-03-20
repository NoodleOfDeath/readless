import { ValuesOfKeys } from '../../../../../types';
import { DatedAttributes } from '../../types';

export const INTERACTION_TYPES = {
  bookmark: 'bookmark',
  comment: 'comment',
  dislike: 'dislike',
  impression: 'impression',
  like: 'like',
  share: 'share',
  view: 'view',
} as const;

export type InteractionType = ValuesOfKeys<typeof INTERACTION_TYPES>;

export type InteractionAttributes = DatedAttributes & {
  /** user that made this interaction **/
  actorId: number;
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