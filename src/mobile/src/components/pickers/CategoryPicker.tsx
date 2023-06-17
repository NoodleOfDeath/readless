import React from 'react';

import { PublicCategoryAttributes } from '~/api';
import {
  ActivityIndicator,
  Button,
  GridPicker,
  View,
} from '~/components';
import {
  Bookmark,
  SessionContext,
  useCategoryClient,
} from '~/core';

export function CategoryPicker() {

  const { getCategories } = useCategoryClient();

  const { bookmarkedCategories, setPreference } = React.useContext(SessionContext);

  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState<PublicCategoryAttributes[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(Object.keys({ ...bookmarkedCategories }));

  const onMount = React.useCallback(async () => {
    setLoading(true);
    const { data: categories, error } = await getCategories();
    if (error) {
      console.log(error);
    } else {
      setCategories(categories.rows);
    }
    setLoading(false);
  }, [getCategories]);

  React.useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <GridPicker
          options={ categories.map((category) => ({
            label: category.displayName,
            value: category.name,
          }
          )) }
          multi
          onValueChange={ (value) => setSelectedCategories(value) } />
      )}
      {!loading && selectedCategories.length > 0 && (
        <Button onPress={ () => {
          setPreference(
            'bookmarkedCategories',
            Object.fromEntries(selectedCategories.map((category) => [category, new Bookmark(categories.find((c) => c.name === category) as PublicCategoryAttributes)]))
          );
        } }>
          Save
        </Button>
      )}
    </View>
  );
}