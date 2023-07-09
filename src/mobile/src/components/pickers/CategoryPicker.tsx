import React from 'react';

import { 
  ChannelIcon,
  ChildlessViewProps,
  GridPicker,
} from '~/components';
import { SessionContext, useCategoryClient } from '~/core';

export type CategoryPickerProps = ChildlessViewProps & {
  onValueChange?: (categories?: string[]) => void;
};

export function CategoryPicker(props: CategoryPickerProps) {
  const { getCategories } = useCategoryClient();
  const { followedCategories, setCategories } = React.useContext(SessionContext);
  const [selectedCategories] = React.useState<string[]>(Object.keys({ ...followedCategories }));
  const fetch = React.useCallback(async () => {
    const { data } = await getCategories();
    setCategories(Object.fromEntries((data.rows).map((r) => [r.name, r])));
    return data.rows.map((category) => ({
      icon: <ChannelIcon category={ category } />,
      label: category.displayName,
      payload: category,
      value: category.name,
    }));
  }, [getCategories, setCategories]);
  return (
    <GridPicker
      { ...props }
      searchable
      options={ fetch }
      multi
      initialValue={ selectedCategories }
      onValueChange={ (states) => {
        const categories = (states ?? []).map((option) => option.value);
        props.onValueChange?.(categories);
      } } />
  );
}