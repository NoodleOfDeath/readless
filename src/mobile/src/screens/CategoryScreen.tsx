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
import { useSummaryClient } from '~/hooks';
import { strings } from '~/locales';
import { ScreenProps } from '~/screens';

export function CategoryScreen({
  route,
  navigation,
}: ScreenProps<'category'>) {

  const { getSummaries } = useSummaryClient();

  const {
    categories,
    followedCategories,
    followCategory,
  } = React.useContext(SessionContext);

  const category0 = React.useMemo(() => route?.params?.category, [route]);
  const category = React.useMemo(() => category0 && categories?.[category0.name], [category0, categories]);

  const [followed, setFollowed] = React.useState((category?.name ?? '') in { ...followedCategories });

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
  
  useFocusEffect(React.useCallback(() => {
    navigation?.setOptions({ headerTitle: '' });
    if (!category) {
      return;
    }
    setFollowed(category.name in { ...followedCategories });
  }, [category, followedCategories, navigation]));
  
  return (
    <Screen>
      <SummaryList
        fetch={ getSummaries }
        filter={ prefilter }
        headerComponent={ (
          <View
            gap={ 6 }
            my={ 12 }
            justifyCenter
            itemsCenter>
            <ChannelIcon rounded size={ 40 } category={ category } />
            <Text 
              h6 
              ml={ 6 }
              bold>
              {category?.displayName}
            </Text>
            <View>
              <Button
                contained
                haptic
                onPress={ toggleFollowed }>
                {`${ followed ? strings.action_unfollow : strings.action_follow } ${ strings.misc_category }`}
              </Button>
            </View>
          </View>
        ) } />
    </Screen>
  );
}
