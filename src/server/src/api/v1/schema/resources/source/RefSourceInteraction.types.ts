import { DatedAttributes } from '../../types';

export type RefSourceInteractionAttributes = DatedAttributes & {
  sourceId: number;
  interactionId: number;
};

export type RefSourceInteractionCreationAttributes = {
  sourceId: number;
  interactionId: number;
};