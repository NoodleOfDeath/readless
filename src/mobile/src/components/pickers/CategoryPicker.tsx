import React from 'react';

import { ChildlessViewProps, GridPicker } from '~/components';
import {
  Bookmark,
  SessionContext,
  useCategoryClient,
} from '~/core';

export type CategoryPickerProps = ChildlessViewProps;

export function CategoryPicker(props: CategoryPickerProps) {
  const { getCategories } = useCategoryClient();
  const { bookmarkedCategories, setPreference } = React.useContext(SessionContext);
  const [selectedCategories] = React.useState<string[]>(Object.keys({ ...bookmarkedCategories }));
  const fetch = React.useCallback(async () => {
    const { data } = await getCategories();
    return data.rows.map((category) => ({
      label: category.displayName,
      payload: category,
      value: category.name,
    }));
  }, [getCategories]);
  return (
    <GridPicker
      { ...props }
      searchable
      options={ fetch }
      multi
      initialValue={ selectedCategories }
      onSave={ 
        (states) => setPreference(
          'bookmarkedCategories', 
          Object.fromEntries(states.map((state) => [state.value, new Bookmark(state.payload)]))
        )
      } />
  );
}