import React from 'react';

import {
  InternalError,
  PublicCategoryAttributes,
  PublicOutletAttributes,
} from '~/api';
import {
  ActivityIndicator,
  Button,
  Checkbox,
  Screen,
  TabSwitcher,
  Text,
  View,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { ClientError, useCategoryClient } from '~/hooks';
import { ScreenProps } from '~/screens';

export function SectionsScreen({ navigation }: ScreenProps<'default'>) {

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
    `News Sources (${outletCount === 0 ? outlets.length : outletCount}/${outlets.length})`,
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
      {loading ? (
        <ActivityIndicator animating />
      ) : (
        <View col mh={ 16 } mb={ 16 }>
          <TabSwitcher 
            activeTab={ activeTab }
            onTabChange={ setActiveTab }
            titles={ titles }>
            <View col height='100%'>
              <View row>
                <View row>
                  <Text>
                    Category
                  </Text>
                </View>
                <View>
                  <Button 
                    onPress={ () => clearBookmarks('bookmarkedCategories') }>
                    { `Follow ${categoryCount > 0 ? `(${categoryCount})` : ''}` }
                  </Button>
                </View>
              </View>
              {categories.map((category) => (
                <View 
                  row
                  alignCenter
                  justifySpaced
                  key={ category.name }>
                  <Button 
                    row
                    selectable
                    alignCenter
                    outlined
                    rounded
                    spacing={ 8 }
                    startIcon={ category.icon }
                    p={ 8 }
                    mv={ 4 }
                    onPress={ () => selectCategory(category) }>
                    {category.displayName}
                  </Button>
                  <Checkbox
                    checked={ Boolean(bookmarkedCategories?.[category.name]) }
                    onPress={ () => followCategory(category) }
                    containerStyle={ { backgroundColor: 'transparent' } } />
                </View>
              ))}
            </View>
            <View col>
              <View row>
                <View row>
                  <Text>
                    News Source
                  </Text>
                </View>
                <View>
                  <Button
                    onPress={ ()=> clearBookmarks('bookmarkedOutlets') }>
                    { `Follow ${outletCount > 0 ? `(${outletCount})` : ''}` }
                  </Button>
                </View>
              </View>
              {outlets.map((outlet) => (
                <View 
                  row
                  alignCenter
                  justifySpaced
                  key={ outlet.name }>
                  <Button 
                    row
                    selectable
                    alignCenter
                    outlined
                    rounded
                    p={ 8 }
                    mv={ 4 }
                    onPress={ () => selectOutlet(outlet) }>
                    {outlet.displayName}
                  </Button>
                  <Checkbox
                    checked={ Boolean(bookmarkedOutlets?.[outlet.name]) }
                    onPress={ () => followOutlet(outlet) }
                    containerStyle={ { backgroundColor: 'transparent' } } />
                </View>
              ))}
            </View>
          </TabSwitcher>
        </View>
      )}
    </Screen>
  );
}
