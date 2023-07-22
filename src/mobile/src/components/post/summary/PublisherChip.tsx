import React from 'react';

import { PublicPublisherAttributes } from '~/api';
import {
  ChannelIcon,
  ChildlessViewProps,
  Chip,
  Text,
} from '~/components';
import { useNavigation, useTheme } from '~/hooks';

export type PublisherChipProps = ChildlessViewProps & {
  publisher?: PublicPublisherAttributes;
  disabled?: boolean;
};

export function PublisherChip({
  publisher,
  disabled,
  ...props
}: PublisherChipProps) {
  const theme = useTheme();
  const { openPublisher } = useNavigation();
  if (!publisher) {
    return null; 
  }
  return (
    <Chip
      { ...props }
      flexRow
      itemsCenter
      gap={ 6 }
      haptic
      onPress={ () => !disabled && openPublisher(publisher) }>
      <ChannelIcon publisher={ publisher } />
      <Text 
        bold
        caption
        color={ theme.colors.textSecondary }>
        {publisher.displayName}
      </Text>
    </Chip>
  );
}