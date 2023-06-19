import React from 'react';

import { ChildlessViewProps, GridPicker } from '~/components';
import { SessionContext, useCategoryClient } from '~/core';

export type CategoryPickerProps = ChildlessViewProps;

export function CategoryPicker(props: CategoryPickerProps) {
  const { getCategories } = useCategoryClient();
  const { followedCategories, setPreference } = React.useContext(SessionContext);
  const [selectedCategories] = React.useState<string[]>(Object.keys({ ...followedCategories }));
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
      onValueChange={ 
        (states) => setPreference(
          'followedCategories', 
          states && Object.fromEntries(states.map((state) => [state.value, true]))
        )
      } />
  );
}