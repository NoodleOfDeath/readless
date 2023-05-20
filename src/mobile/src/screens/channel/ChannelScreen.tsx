import React from 'react';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PublicCategoryAttributes } from '~/api';
import {
  Button,
  Screen,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import {
  ScreenProps,
  SearchScreen,
  StackableTabParams,
} from '~/screens';

export function ChannelScreen({
  route,
  navigation,
}: ScreenProps<'channel'>) {

  const {
    preferences: {
      bookmarkedCategories,
      bookmarkedOutlets,
    },
    followOutlet,
    followCategory,
  } = React.useContext(SessionContext);

  const type = React.useMemo(() => route?.params?.type, [route]);
  const attributes = React.useMemo(() => route?.params?.attributes, [route]);

  const bookmarked = React.useMemo(() => {
    if (!attributes) {
      return false;
    }
    switch (type) {
    case 'category':
      return bookmarkedCategories?.[attributes.name];
    case 'outlet':
      return bookmarkedOutlets?.[attributes.name];
    default:
      return false;
    }
  }, [attributes, type, bookmarkedCategories, bookmarkedOutlets]);

  const prefilter = React.useMemo(() => {
    if (!attributes) {
      return undefined;
    }
    switch (type) {
    case 'category':
      return `cat:${attributes.name}`;
    case 'outlet':
      return `src:${attributes.name}`;
    default:
      return undefined;
    }
  }, [attributes, type]);

  return (
    <Screen>
      <View col gap={ 12 } mt={ 12 }>
        <View row alignCenter elevated height={ 80 } p={ 12 } mh={ 12 }>
          <View>
            <Text h6 capitalize>{attributes?.displayName}</Text>
            <Text subtitle2>{type === 'category' ? 'Category' : 'News Source'}</Text>
          </View>
          <View row />
          <View>
            <Button
              elevated
              body2
              rounded
              p={ 6 }
              onPress={ () => attributes && (type === 'category' ? followCategory(attributes as PublicCategoryAttributes) : followOutlet(attributes)) }>
              { bookmarked ? 'Unfollow Channel' : 'Follow Channel' }
            </Button>
          </View>
        </View>
        <View col>
          <SearchScreen
            navigation={ navigation as NativeStackNavigationProp<StackableTabParams, 'search'> }
            route={ {
              key: 'search',
              name: 'search',
              params: { prefilter },
            } } />
        </View>
      </View>
    </Screen>
  );
}
