import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
  Button,
  Header,
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
    followedCategories,
    followCategory,
  } = React.useContext(SessionContext);

  const category = React.useMemo(() => route?.params?.category, [route]);

  const [loaded, setLoaded] = React.useState(false);
  const [followed, setFollowed] = React.useState((category?.name ?? '') in { ...followedCategories });

  const prefilter = React.useMemo(() => {
    if (!category) {
      return undefined;
    }
    return `cat:${category.name}`;
  }, [category]);

  React.useEffect(() => {
    if (loaded) {
      return; 
    }
    setLoaded(true);
    setFollowed((category?.name ?? '') in { ...followedCategories });
  }, [category, followedCategories, loaded]);

  const toggleFollowed = React.useCallback(() => {
    if (!category) {
      return;
    }
    setFollowed((prev) => !prev);
    followCategory(category);
  }, [category, followCategory]);
  
  useFocusEffect(React.useCallback(() => {
    navigation?.setOptions({
      header: () => (
        <Header 
          back
          big
          elevated>
          <View
            gap={ 6 } 
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
                body2
                contained
                haptic
                onPress={ toggleFollowed }>
                {`${ followed ? strings.action_unfollow : strings.action_follow } ${ strings.misc_category }`}
              </Button>
            </View>
          </View>
        </Header>
      ),
    });
  }, [category, followed, navigation, toggleFollowed]));
  
  return (
    <Screen>
      <SummaryList
        fetch={ getSummaries }
        filter={ prefilter } />
    </Screen>
  );
}
