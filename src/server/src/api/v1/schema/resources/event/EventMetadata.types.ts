import { MetadataAttributes, MetadataCreationAttributes } from '../../metadata/Metadata.types';

export type EventMetadataKey = 'poll.options';

export type EventMetadataAttributes<Group extends string> = MetadataAttributes<EventMetadataKey, Group>;

export type EventMetadataCreationAttributes<Group extends string> = MetadataCreationAttributes<EventMetadataKey, Group>;