import React from 'react';

import { CheckBox } from '@rneui/base';

import {
  CategoryAttributes,
  InternalError,
  OutletAttributes,
} from '~/api';
import {
  Button,
  Screen,
  TabSwitcher,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
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

  const [categories, setCategories] = React.useState<CategoryAttributes[]>([]);
  const [outlets, setOutlets] = React.useState<OutletAttributes[]>([]);
  const [_, setError] = React.useState<InternalError>();
  
  const categoryCount = React.useMemo(() => Object.values(bookmarkedCategories ?? {}).length, [bookmarkedCategories]);
  const outletCount = React.useMemo(() => Object.values(bookmarkedOutlets ?? {}).length, [bookmarkedOutlets]);
  
  const titles = React.useMemo(() => [
    `Categories (${categoryCount}/${categories.length})`,
    `Outlets (${outletCount}/${outlets.length})`,
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

  const selectCategory = React.useCallback((category: CategoryAttributes) => {
    navigation?.navigate('search', { prefilter: `category:${category.name}` });
  }, [navigation]);

  const selectOutlet = React.useCallback((outlet: OutletAttributes) => {
    navigation?.navigate('search', { prefilter: `outlet:${outlet.id}`, title: `outlet:${outlet.displayName}` });
  }, [navigation]);
  
  const followCategory = React.useCallback((category: CategoryAttributes) => {
    setPreference('bookmarkedCategories', (prev) => {
      const state = { ...prev };
      if (!state[category.name]) {
        state[category.name] = category;
      } else {
        delete state[category.name];
      }
      return (prev = state);
    });
  }, [setPreference]);
  
  const followOutlet = React.useCallback((outlet: OutletAttributes) => {
    setPreference('bookmarkedOutlets', (prev) => {
      const state = { ...prev };
      if (!state[outlet.name]) {
        state[outlet.name] = outlet;
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
      <View col>
        <TabSwitcher 
          activeTab={ activeTab }
          onTabChange={ setActiveTab }
          titles={ titles }>
          <View col height='100%'>
            <View row>
              <View row>
                <Text 
                  left 
                  variant='subtitle1'>
                  Category
                </Text>
              </View>
              <View>
                <Text 
                  left
                  variant='subtitle1'>
                  Follow 
                  {' '}
                  {categoryCount > 0 && (
                    <React.Fragment>
                      (
                      {categoryCount}
                      )
                    </React.Fragment>
                  )}
                </Text>
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
                  startIcon={ category.icon }
                  p={ 8 }
                  mv={ 4 }
                  onPress={ () => selectCategory(category) }>
                  {category.name}
                </Button>
                <CheckBox
                  checked={ Boolean(bookmarkedCategories?.[category.name]) }
                  onPress={ () => followCategory(category) } />
              </View>
            ))}
          </View>
          <View col>
            <View row>
              <View row>
                <Text 
                  left
                  variant='subtitle1'>
                  News Source
                </Text>
              </View>
              <View>
                <Text
                  left
                  variant='subtitle1'>
                  Follow 
                  {' '}
                  {outletCount > 0 && (
                    <React.Fragment>
                      (
                      {outletCount}
                      )
                    </React.Fragment>
                  )}
                </Text>
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
                <CheckBox
                  checked={ Boolean(bookmarkedOutlets?.[outlet.name]) }
                  onPress={ () => followOutlet(outlet) } />
              </View>
            ))}
          </View>
        </TabSwitcher>
      </View>
    </Screen>
  );
}
