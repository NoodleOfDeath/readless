import React from 'react';

import { 
  ChannelIcon,
  ChildlessViewProps, 
  GridPicker,
} from '~/components';
import { SessionContext, useCategoryClient } from '~/core';

export type PublisherPickerProps = ChildlessViewProps & {
  onValueChange?: (publishers?: string[]) => void;
};

export function PublisherPicker(props: PublisherPickerProps) {
  const { getPublishers } = useCategoryClient();
  const { followedPublishers, setPublishers } = React.useContext(SessionContext);
  const [selectedPublishers] = React.useState<string[]>(Object.keys({ ...followedPublishers }));
  const fetch = React.useCallback(async () => {
    const { data } = await getPublishers();
    setPublishers(Object.fromEntries((data.rows).map((r) => [r.name, r])));
    return data.rows.map((publisher) => ({
      icon: <ChannelIcon publisher={ publisher } />,
      label: publisher.displayName,
      payload: publisher,
      value: publisher.name,
    }));
  }, [getPublishers, setPublishers]);
  return (
    <GridPicker
      { ...props }
      options={ fetch }
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