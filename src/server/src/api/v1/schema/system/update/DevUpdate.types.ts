import {
  PUBLIC_POST_ATTRIBUTES,
  PostAttributes,
  PostCreationAttributes,
} from '../../resources/Post.types';

export type DevUpdateAttributes = PostAttributes;

export type DevUpdateCreationAttributes = PostCreationAttributes;

export const PUBLIC_DEV_UPDATE_ATTRIBUTES = PUBLIC_POST_ATTRIBUTES;

export type PublicDevUpdateAttributes = DevUpdateAttributes;