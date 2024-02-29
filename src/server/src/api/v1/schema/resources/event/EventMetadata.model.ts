import { Table } from 'sequelize-typescript';

import {
  EventMetadataAttributes,
  EventMetadataCreationAttributes,
  EventMetadataKey,
} from './EventMetadata.types';
import { Metadata } from '../../metadata/Metadata.model';

@Table({
  modelName: 'event_metadata',
  paranoid: true,
  timestamps: true,
})
export class EventMetadata<
  Group extends string, 
  A extends EventMetadataAttributes<Group> = EventMetadataAttributes<Group>, 
  B extends EventMetadataCreationAttributes<Group> = EventMetadataCreationAttributes<Group>
> extends Metadata<EventMetadataKey, Group, A, B> {

}