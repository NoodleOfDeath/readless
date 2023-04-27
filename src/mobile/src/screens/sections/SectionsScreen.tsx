import React from 'react';

import {
  InternalError,
  PublicCategoryAttributes,
  PublicOutletAttributes,
} from '~/api';
import {
  Button,
  Screen,
  TabSwitcher,
  View,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import {
  ClientError,
  useCategoryClient,
  useTheme,
} from '~/hooks';
import { ScreenProps } from '~/screens';

export function SectionsScreen({ navigation }: ScreenProps<'default'>) {

  const theme = useTheme();
  const { getCategories, getOutlets } = useCategoryClient();
  const {
    preferences: {
      bookmarkedCategories,
      bookmarkedOutlets,
    },
    setPreference,
  } = React.useContext(SessionContext);
  
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState(0);

  const [categories, setCategories] = React.useState<PublicCategoryAttributes[]>([]);
  const [outlets, setOutlets] = React.useState<PublicOutletAttributes[]>([]);
  const [_, setError] = React.useState<InternalError>();
  
  const categoryCount = React.useMemo(() => Object.values(bookmarkedCategories ?? {}).length, [bookmarkedCategories]);
  const outletCount = React.useMemo(() => Object.values(bookmarkedOutlets ?? {}).length, [bookmarkedOutlets]);
  
  const titles = React.useMemo(() => [
    `Categories (${categoryCount === 0 ? categories.length : categoryCount}/${categories.length})`,
    `Sources (${outletCount === 0 ? outlets.length : outletCount}/${outlets.length})`,
  ], [categories, categoryCount, outlets, outletCount]);

  const loadCategories = React.useCallback(async () => {
    setError(undefined);
    const { data, error } = await getCategories();
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }
    if (!data) {
      setError(new ClientError('UNKNOWN'));
      setLoading(false);
      return;
    }
    setCategories(data.rows);
    setLoading(false);
  }, [getCategories]);

  const loadOutlets = React.useCallback(async () => {
    setError(undefined);
    const { data, error } = await getOutlets();
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }
    if (!data) {
      setError(new ClientError('UNKNOWN'));
      setLoading(false);
      return;
    }
    setOutlets(data.rows);
    setLoading(false);
  }, [getOutlets]);

  React.useEffect(() => {
    loadCategories();
    loadOutlets();
  }, [loadCategories, loadOutlets]);

  const selectCategory = React.useCallback((category: PublicCategoryAttributes) => {
    navigation?.navigate('search', { prefilter: `cat:${category.name.toLowerCase().replace(/\s/g, '-')}` });
  }, [navigation]);

  const selectOutlet = React.useCallback((outlet: PublicOutletAttributes) => {
    navigation?.navigate('search', { prefilter: `src:${outlet.name}` });
  }, [navigation]);
  
  const followCategory = React.useCallback((category: PublicCategoryAttributes) => {
    setPreference('bookmarkedCategories', (prev) => {
      const state = { ...prev };
      if (!state[category.name]) {
        state[category.name] = new Bookmark(category);
      } else {
        delete state[category.name];
      }
      return (prev = state);
    });
  }, [setPreference]);
  
  const followOutlet = React.useCallback((outlet: PublicOutletAttributes) => {
    setPreference('bookmarkedOutlets', (prev) => {
      const state = { ...prev };
      if (!state[outlet.name]) {
        state[outlet.name] = new Bookmark(outlet);
      } else {
        delete state[outlet.name];
      }
      return (prev = state);
    });
  }, [setPreference]);
  
  const clearBookmarks = React.useCallback((key: 'bookmarkedCategories' | 'bookmarkedOutlets') => {
    setPreference(key, {});
  }, [setPreference]);

  return (
    <Screen
      refreshing={ loading }
      onRefresh={ () => activeTab === 0 ? loadCategories() : loadOutlets() }>
      <View col mb={ 16 }>
        <TabSwitcher 
          tabHeight={ 48 }
          activeTab={ activeTab }
          onTabChange={ setActiveTab }
          titles={ titles }>
          <View col height='100%' mh={ 16 } gap={ 8 }>
            <View row>
              <View row />
              <Button 
                elevated
                selectable
                alignCenter
                rounded
                gap={ 8 }
                p={ 8 }
                onPress={ () => clearBookmarks('bookmarkedCategories') }>
                {categoryCount > 0 ? 'Clear Selection' : ''}
              </Button>
            </View>
            {categories.map((category, i) => (
              <View 
                key={ category.name }
                row
                bg={ i % 2 === 0 ? theme.components.card.backgroundColor : undefined }>
                <Button 
                  row
                  elevated
                  selectable
                  alignCenter
                  rounded
                  gap={ 8 }
                  startIcon={ category.icon }
                  p={ 8 }
                  onPress={ () => selectCategory(category) }>
                  {category.displayName}
                </Button>
                <View row />
                <Button
                  row
                  rounded
                  gap={ 8 }
                  p={ 8 }
                  elevated
                  startIcon={ bookmarkedCategories?.[category.name] ? 'check' : undefined }
                  onPress={ () => followCategory(category) }>
                  {bookmarkedCategories?.[category.name] ? 'Unfollow' : 'Follow'}
                </Button>
              </View>
            ))}
          </View>
          <View col mh={ 16 } gap={ 8 }>
            <View row>
              <View row />
              <View>
                <Button
                  elevated
                  selectable
                  alignCenter
                  rounded
                  gap={ 8 }
                  p={ 8 }
                  onPress={ ()=> clearBookmarks('bookmarkedOutlets') }>
                  {outletCount > 0 ? 'Clear Selection' : ''}
                </Button>
              </View>
            </View>
            {outlets.map((outlet, i) => (
              <View 
                key={ outlet.name }
                row
                bg={ i % 2 === 0 ? theme.components.card.backgroundColor : undefined }>
                <Button 
                  row
                  elevated
                  selectable
                  alignCenter
                  rounded
                  gap={ 8 }
                  p={ 8 }
                  onPress={ () => selectOutlet(outlet) }>
                  {outlet.displayName}
                </Button>
                <View row />
                <Button
                  row
                  rounded
                  gap={ 8 }
                  p={ 8 }
                  elevated
                  startIcon={ bookmarkedOutlets?.[outlet.name] ? 'check' : undefined }
                  onPress={ () => followOutlet(outlet) }>
                  {bookmarkedOutlets?.[outlet.name] ? 'Unfollow' : 'Follow'}
                </Button>
              </View>
            ))}
          </View>
        </TabSwitcher>
      </View>
    </Screen>
  );
}