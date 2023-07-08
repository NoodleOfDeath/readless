import React from 'react';

import { ChildlessViewProps, GridPicker } from '~/components';
import { SessionContext, useCategoryClient } from '~/core';

export type PublisherPickerProps = ChildlessViewProps & {
  onValueChange?: (publishers?: string[]) => void;
};

export function PublisherPicker(props: PublisherPickerProps) {
  const { getPublishers } = useCategoryClient();
  const { followedPublishers } = React.useContext(SessionContext);
  const [selectedPublishers] = React.useState<string[]>(Object.keys({ ...followedPublishers }));
  const fetch = React.useCallback(async () => {
    const { data } = await getPublishers();
    return data.rows.map((publisher) => ({
      label: publisher.displayName,
      payload: publisher,
      value: publisher.name,
    }));
  }, [getPublishers]);
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