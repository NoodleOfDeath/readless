import React from 'react';

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
  navigation: _navigation,
}: ScreenProps<'category'>) {

  const { getSummaries } = useSummaryClient();

  const {
    followedCategories,
    followCategory,
  } = React.useContext(SessionContext);

  const category = React.useMemo(() => route?.params?.category, [route]);

  const [loaded, setLoaded] = React.useState(false);
  const [followed, setFollowed] = React.useState(category?.name ?? '' in { ...followedCategories });

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
    setFollowed(category?.name ?? '' in { ...followedCategories });
  }, [category, followedCategories, loaded]);

  const toggleFollowed = React.useCallback(() => {
    if (!category) {
      return;
    }
    setFollowed((prev) => !prev);
    followCategory(category);
  }, [category, followCategory]);
  
  return (
    <Screen>
      <View col>
        <View 
          row 
          itemsCenter
          elevated
          zIndex={ 100 }
          height={ 80 } 
          p={ 12 }>
          <View flexRow gap={ 12 } itemsCenter>
            <ChannelIcon size={ 40 } category={ category } />
            <View>
              <Text 
                h6 
                bold>
                {category?.displayName}
              </Text>
              <Text subtitle2>{strings.misc_category}</Text>
            </View>
          </View>
          <View row />
          <View>
            <Button
              body2
              contained
              onPress={ toggleFollowed }>
              {`${ followed ? strings.action_unfollow : strings.action_follow } ${strings.misc_category }`}
            </Button>
          </View>
        </View>
        <View col>
          <SummaryList
            fetch={ getSummaries }
            filter={ prefilter } />
        </View>
      </View>
    </Screen>
  );
}
