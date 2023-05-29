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
import { strings } from '~/locales';
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
    bookmarkedOutlets,
    bookmarkedCategories,
    followOutlet,
    followCategory,
  } = React.useContext(SessionContext);

  const type = React.useMemo(() => route?.params?.type, [route]);
  const attributes = React.useMemo(() => route?.params?.attributes, [route]);

  const [bookmarked, setBookmarked] = React.useState(false);
  
  React.useEffect(() => {
    if (!attributes) {
      return;
    }
    type === 'category' ? 
      setBookmarked(attributes.name in (bookmarkedCategories ?? {})) :
      setBookmarked(attributes.name in (bookmarkedOutlets ?? {}));
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

  const toggleBookmarked = React.useCallback(() => {
    if (!attributes) {
      return;
    }
    setBookmarked((prev) => !prev);
    type === 'category' ? 
      followCategory(attributes as PublicCategoryAttributes) :
      followOutlet(attributes);
  }, [attributes, type, followCategory, followOutlet]);
  
  return (
    <Screen>
      <View col gap={ 12 } mt={ 12 }>
        <View row alignCenter elevated height={ 80 } p={ 12 } mh={ 12 }>
          <View>
            <Text h6 capitalize>{attributes?.displayName}</Text>
            <Text subtitle2>{type === 'category' ? strings.category : strings.newsSource}</Text>
          </View>
          <View row />
          <View>
            <Button
              elevated
              body2
              rounded
              p={ 6 }
              onPress={ toggleBookmarked }>
              { bookmarked ? strings.unfollowChannel : strings.followChannel }
            </Button>
          </View>
        </View>
        <View col>
          <SearchScreen
            navigation={ navigation as unknown as NativeStackNavigationProp<StackableTabParams, 'search'> }
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
