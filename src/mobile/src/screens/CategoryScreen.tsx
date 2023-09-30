import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
  Button,
  Screen,
  SummaryList,
  Text,
  View,
} from '~/components';
import { ChannelIcon } from '~/components/post/ChannelIcon';
import { SessionContext } from '~/contexts';
import { useApiClient } from '~/hooks';
import { strings } from '~/locales';
import { ScreenProps } from '~/screens';

export function CategoryScreen({
  route,
  navigation,
}: ScreenProps<'category'>) {

  const { getSummaries } = useApiClient();

  const {
    categories,
    isFollowingCategory,
    followCategory,
    categoryIsFavorited,
    favoriteCategory,
  } = React.useContext(SessionContext);

  const category0 = React.useMemo(() => route?.params?.category, [route]);
  const category = React.useMemo(() => category0 && categories?.[category0.name], [category0, categories]);

  const [followed, setFollowed] = React.useState(category && isFollowingCategory(category));
  const [favorited, setFavorited] = React.useState(category && categoryIsFavorited(category));

  const prefilter = React.useMemo(() => {
    if (!category) {
      return undefined;
    }
    return `cat:${category.name}`;
  }, [category]);

  const toggleFollowed = React.useCallback(() => {
    if (!category) {
      return;
    }
    setFollowed((prev) => !prev);
    followCategory(category);
  }, [category, followCategory]);
  
  const toggleFavorited = React.useCallback(() => {
    if (!category) {
      return;
    }
    setFavorited((prev) => !prev);
    favoriteCategory(category);
  }, [category, favoriteCategory]);
  
  useFocusEffect(React.useCallback(() => {
    navigation?.setOptions({
      headerTitle: () => (
        <View flexRow gap={ 6 } itemsCenter>
          <Text  
            h6 
            ml={ 6 }
            bold>
            {category?.displayName}
          </Text>
        </View>
      ), 
    });
    if (!category) {
      return;
    }
    setFollowed(isFollowingCategory(category));
    setFavorited(categoryIsFavorited(category));
  }, [category, isFollowingCategory, categoryIsFavorited, navigation]));
  
  return (
    <Screen>
      <SummaryList
        fetch={ getSummaries }
        filter={ prefilter }
        headerComponent={ (
          <View
            gap={ 6 }
            mb={ 12 }
            justifyCenter
            itemsCenter>
            <ChannelIcon rounded size={ 80 } category={ category } />
            <View flexRow gap={ 6 }>
              <Button
                contained
                haptic
                onPress={ toggleFollowed }>
                {`${ followed ? strings.action_unfollow : strings.action_follow } ${ strings.misc_category }`}
              </Button>
              <Button
                leftIcon={ favorited ? 'star' : 'star-outline' }
                haptic 
                iconSize={ 24 }
                onPress={ toggleFavorited }
                accessibilityLabel={ favorited ? strings.action_unfavorite : strings.action_favorite } />
            </View>
          </View>
        ) } />
    </Screen>
  );
}
