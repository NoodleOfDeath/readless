import React from 'react';

import { 
  ChannelIcon,
  ChildlessViewProps,
  GridPicker,
} from '~/components';
import { SessionContext } from '~/core';

export type CategoryPickerProps = ChildlessViewProps & {
  onValueChange?: (categories?: string[]) => void;
};

export function CategoryPicker(props: CategoryPickerProps) {
  const { followedCategories, categories } = React.useContext(SessionContext);
  const [selectedCategories] = React.useState<string[]>(Object.keys({ ...followedCategories }));
  return (
    <GridPicker
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
        props.onValueChange?.(categories);
      } } />
  );
}