import React from 'react';

import { 
  ChannelIcon,
  ChildlessViewProps, 
  GridPicker,
} from '~/components';
import { SessionContext } from '~/core';

export type PublisherPickerProps = ChildlessViewProps & {
  onValueChange?: (publishers?: string[]) => void;
};

export function PublisherPicker(props: PublisherPickerProps) {
  const { followedPublishers, publishers } = React.useContext(SessionContext);
  const [selectedPublishers] = React.useState<string[]>(Object.keys({ ...followedPublishers }));
  return (
    <GridPicker
      { ...props }
      options={ Object.values({ ...publishers }).map((publisher) => ({
        icon: <ChannelIcon publisher={ publisher } />,
        label: publisher.displayName,
        payload: publisher,
        value: publisher.name,
      })) }
      multi
      initialValue={ selectedPublishers }
      searchable
      onValueChange={ 
        (states) => { 
          const publishers = (states ?? []).map((option) => option.value);
          props.onValueChange?.(publishers);
        }
      } />
  );
}