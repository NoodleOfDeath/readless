import React from 'react';

import { PublicCategoryAttributes } from '../../api';

import { ChildlessViewProps, GridPicker } from '~/components';
import { SessionContext, useCategoryClient } from '~/core';

export type CategoryPickerProps = ChildlessViewProps & {
  onValueChange?: (categories?: PublicCategoryAttributes[]) => void;
};

export function CategoryPicker(props: CategoryPickerProps) {
  const { getCategories } = useCategoryClient();
  const { followedCategories } = React.useContext(SessionContext);
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
      onValueChange={ (states) => {
        alert(JSON.stringify(states));
        const categories = (states ?? []).map((option) => option.payload).filter(Boolean) as PublicCategoryAttributes[];
        props.onValueChange?.(categories);
      } } />
  );
}