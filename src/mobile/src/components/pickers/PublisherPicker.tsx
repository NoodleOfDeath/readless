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

export const PublisherPicker = React.forwardRef(function PublisherPicker(props: PublisherPickerProps, ref: React.ForwardedRef<{ value: string[] }>) {
  const { followedPublishers, publishers } = React.useContext(SessionContext);
  const [selectedPublishers, setSelectedPublishers] = React.useState<string[]>(Object.keys({ ...followedPublishers }));
  const options = React.useMemo(() => Object.values({ ...publishers }).map((publisher) => ({
    icon: <ChannelIcon publisher={ publisher } />,
    label: publisher.displayName,
    value: publisher.name,
  })), [publishers]);
  React.useImperativeHandle(ref, React.useCallback(() => ({ value: selectedPublishers }), [selectedPublishers]));
  return (
    <GridPicker
      { ...props }
      options={ options }
      multi
      initialValue={ selectedPublishers }
      searchable
      onValueChange={ (publishers) => { 
        setSelectedPublishers(publishers ?? []);
        props.onValueChange?.(publishers);
      } } />
  );
}) as React.ForwardRefExoticComponent<PublisherPickerProps & React.RefAttributes<{ value: string[] }>>;