import React from 'react';

import { ChildlessViewProps, GridPicker } from '~/components';
import {
  Bookmark,
  SessionContext,
  useCategoryClient,
} from '~/core';

export type OutletPickerProps = ChildlessViewProps;

export function OutletPicker(props: OutletPickerProps) {
  const { getOutlets } = useCategoryClient();
  const { bookmarkedOutlets, setPreference } = React.useContext(SessionContext);
  const [selectedOutlets] = React.useState<string[]>(Object.keys({ ...bookmarkedOutlets }));
  const fetch = React.useCallback(async () => {
    const { data } = await getOutlets();
    return data.rows.map((outlet) => ({
      label: outlet.displayName,
      payload: outlet,
      value: outlet.name,
    }));
  }, [getOutlets]);
  return (
    <GridPicker
      { ...props }
      options={ fetch }
      multi
      initialValue={ selectedOutlets }
      onSave={ 
        (states) => setPreference(
          'bookmarkedOutlets', 
          Object.fromEntries(states.map((state) => [state.value, new Bookmark(state.payload)]))
        )
      } />
  );
}