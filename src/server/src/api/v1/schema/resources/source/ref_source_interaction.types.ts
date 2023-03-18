import { DatedAttributes } from '../../types';

export type RefSourceInteractionAttributes = DatedAttributes & {
  sourceId: number;
  interactionId: number;
};

export type RefSourceInteractionCreationAttributes = DatedAttributes & {
  sourceId: number;
  interactionId: number;
};