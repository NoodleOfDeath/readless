import React from 'react';

import {
  CategoryAttributes,
  InternalError,
  OutletAttributes,
} from '~/api';
import {
  Button,
  Screen,
  TabSwitcher,
  View,
} from '~/components';
import { ClientError, useCategoryClient } from '~/hooks';
import { ScreenProps } from '~/screens';

export function SectionsScreen({ navigation }: ScreenProps<'default'>) {

  const { getCategories, getOutlets } = useCategoryClient();
  
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState(0);

  const [categories, setCategories] = React.useState<CategoryAttributes[]>([]);
  const [outlets, setOutlets] = React.useState<OutletAttributes[]>([]);
  const [_, setError] = React.useState<InternalError>();

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

  return (
    <Screen
      refreshing={ loading }
      onRefresh={ () => activeTab === 0 ? loadCategories() : loadOutlets() }>
      <View col p={ 16 }>
        <TabSwitcher 
          activeTab={ activeTab }
          onTabChange={ setActiveTab }
          titles={ ['Categories', 'News Sources'] }>
          <View col>
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
              </View>
            ))}
          </View>
          <View col>
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
              </View>
            ))}
          </View>
        </TabSwitcher>
      </View>
    </Screen>
  );
}
