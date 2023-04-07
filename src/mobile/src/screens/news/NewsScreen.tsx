import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { CategoryAttributes, InternalError } from '~/api';
import {
  Button,
  SafeScrollView,
  View,
} from '~/components';
import { ClientError, useCategoryClient } from '~/hooks';
import { RootParamList } from '~/screens';

type Props = {
  route?: RouteProp<RootParamList['newsTab'], 'default'>;
  navigation?: NativeStackNavigationProp<RootParamList['newsTab'], 'default'>;
};

export function NewsScreen({ navigation }: Props) {

  const { getCategories } = useCategoryClient();
  
  const [loading, setLoading] = React.useState(true);
  const [categories, setCategories] = React.useState<CategoryAttributes[]>([]);
  const [error, setError] = React.useState<InternalError>();

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

  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const selectCategory = React.useCallback((category: string) => {
    navigation?.navigate('search', { prefilter: `category:${category}` });
  }, [navigation]);

  return (
    <SafeScrollView
      refreshing={ loading }
      onRefresh={ () => loadCategories() }>
      <View col p={ 32 }>
        {categories.map(({ name, icon }) => (
          <View 
            row
            alignCenter
            justifySpaced
            key={ name }>
            <Button 
              row
              selectable
              alignCenter
              outlined
              rounded
              startIcon={ icon }
              p={ 8 }
              mv={ 4 }
              onPress={ () => selectCategory(name) }>
              {name}
            </Button>
          </View>
        ))}
      </View>
    </SafeScrollView>
  );
}
