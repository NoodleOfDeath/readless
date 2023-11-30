import {
  PUBLIC_POST_ATTRIBUTES,
  PostAttributes,
  PostCreationAttributes,
} from '../../resources/Post.types';

export type SystemNotificationAttributes = PostAttributes;

export type SystemNotificationCreationAttributes = PostCreationAttributes;

export const PUBLIC_SYSTEM_NOTIFICATION_ATTRIBUTES = PUBLIC_POST_ATTRIBUTES;

export type PublicSystemNotificationAttributes = SystemNotificationAttributes;