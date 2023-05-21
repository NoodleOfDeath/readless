import { DatedAttributes } from '../../types';

export type MessageType = 'system';

export type MessageAttributes = DatedAttributes & {
  type: MessageType;
  title: string;
  description?: string;
};

export type MessageCreationAttributes = {
  type: MessageType;
  title: string;
  description?: string;
};

export const PUBLIC_MESSAGE_ATTRIBUTES = ['type', 'title', 'description', 'createdAt'];