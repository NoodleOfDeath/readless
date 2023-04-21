import React from 'react';

import {
  InternalError,
  PublicCategoryAttributes,
  PublicOutletAttributes,
} from '~/api';
import {
  ActivityIndicator,
  Button,
  Grid,
  Screen,
  TabSwitcher,
  View,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { ClientError, useCategoryClient } from '~/hooks';

export function SectionsScreen() {

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

  const sortedOutlets = React.useMemo(() => [...outlets].sort((a, b) => a.name.replace(/^the/i, '').localeCompare(b.name.replace(/^the/i, ''))), [outlets]);
  
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
            <Grid alignCenter justifyCenter>
              {categories.map((category) => (
                <Button
                  key={ category.name }
                  selected={ Boolean(bookmarkedCategories?.[category.name]) }
                  selectable
                  height={ 80 }
                  alignCenter
                  justifyCenter
                  outlined
                  rounded
                  spacing={ 4 }
                  startIcon={ category.icon }
                  p={ 8 }
                  m={ 4 }
                  onPress={ () => followCategory(category) }>
                  {category.displayName}
                </Button>
              ))}
            </Grid>
            <Grid alignCenter justifyCenter>
              {sortedOutlets.map((outlet) => (
                <Button 
                  key={ outlet.name }
                  selected={ Boolean(bookmarkedOutlets?.[outlet.name]) }
                  selectable
                  alignCenter
                  outlined
                  rounded
                  p={ 8 }
                  m={ 4 }
                  onPress={ () => followOutlet(outlet) }>
                  {outlet.displayName}
                </Button>
              ))}
            </Grid>
          </TabSwitcher>
        </View>
      )}
    </Screen>
  );
}
