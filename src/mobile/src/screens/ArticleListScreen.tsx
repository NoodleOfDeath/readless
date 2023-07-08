import React from 'react';

import {
  FlatList,
  Screen,
  Summary,
} from '~/components';
import { ScreenProps } from '~/screens';

export function ArticleListScreen({
  route,
  navigation: _navigation,
}: ScreenProps<'articles'>) {

  const summary = React.useMemo(() => route?.params?.summary, [route]);
  
  return (
    <Screen>
      <Summary summary={ summary } />
      <FlatList
        data={ summary?.siblings }
        renderItem={ ({ item }) => (
          <Summary summary={ item } compact />
        ) }
        keyExtractor={ (item) => `${item.id}` } />
    </Screen>
  );
}
