import React from 'react';

import { 
  ChannelIcon,
  ChildlessViewProps,
  TablePicker,
} from '~/components';
import { StorageContext } from '~/core';

export type CategoryPickerProps = ChildlessViewProps & {
  onValueChange?: (categories?: string[]) => void;
};

export const CategoryPicker = React.forwardRef(function CategoryPicker(props: CategoryPickerProps, ref: React.ForwardedRef<{value: string[]}>) {
  const { followedCategories, categories } = React.useContext(StorageContext);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(Object.keys({ ...followedCategories }));
  React.useImperativeHandle(ref, React.useCallback(() => ({ value: selectedCategories }), [selectedCategories]));
  return (
    <TablePicker
      { ...props }
      searchable
      options={ Object.values({ ...categories }).map((category) => ({
        icon: <ChannelIcon category={ category } />,
        label: category.displayName,
        payload: category,
        value: category.name,
      })) }
      multi
      initialValue={ selectedCategories }
      onValueChange={ (categories) => {
        setSelectedCategories(categories ?? []);
        props.onValueChange?.(categories);
      } } />
  );
}) as React.ForwardRefExoticComponent<CategoryPickerProps & React.RefAttributes<{value: string[]}>>;