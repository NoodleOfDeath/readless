import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { InternalError, SummaryCategory } from '~/api';
import {
  Button,
  SafeScrollView,
  View,
} from '~/components';
import { ClientError, useSummaryClient } from '~/hooks';
import { RootParamList } from '~/screens';

type Props = {
  route: RouteProp<RootParamList['news'], 'default'>;
  navigation: NativeStackNavigationProp<RootParamList['news'], 'default'>;
};

export function NewsScreen({ navigation }: Props) {

  const { getSummaryCategories } = useSummaryClient();
  
  const [loading, setLoading] = React.useState(true);
  const [categories, setCategories] = React.useState<SummaryCategory[]>([]);
  const [error, setError] = React.useState<InternalError | undefined>();

  const loadCategories = React.useCallback(async () => {
    setError();
    const { data, error } = await getSummaryCategories();
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
  }, [getSummaryCategories]);

  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const selectCategory = React.useCallback((category: string) => {
    const payload = { prefilter: `category:${category}` };
    console.log(payload);
    navigation.navigate('category', payload);
  }, [navigation]);

  return (
    <SafeScrollView
      refreshing={ loading }
      onRefresh={ () => loadCategories() }>
      <View col p={ 32 }>
        {categories.map((category) => (
          <View 
            row
            alignCenter
            justifySpaced
            key={ category.category }>
            <Button 
              row
              selectable
              outlined
              rounded
              p={ 8 }
              mv={ 4 }
              onPress={ () => selectCategory(category.category) }>
              {category.category}
            </Button>
          </View>
        ))}
      </View>
    </SafeScrollView>
  );
}
