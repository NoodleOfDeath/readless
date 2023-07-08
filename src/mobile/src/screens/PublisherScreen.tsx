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

export function PublisherScreen({
  route,
  navigation: _navigation,
}: ScreenProps<'publisher'>) {

  const { getSummaries } = useSummaryClient();

  const {
    followedPublishers,
    followPublisher,
  } = React.useContext(SessionContext);

  const publisher = React.useMemo(() => route?.params?.publisher, [route]);

  const [loaded, setLoaded] = React.useState(false);
  const [followed, setFollowed] = React.useState((publisher?.name ?? '') in { ...followedPublishers });

  const prefilter = React.useMemo(() => {
    if (!publisher) {
      return undefined;
    }
    return `pub:${publisher.name}`;
  }, [publisher]);

  React.useEffect(() => {
    if (loaded) {
      return; 
    }
    setLoaded(true);
    setFollowed((publisher?.name ?? '') in { ...followedPublishers });
  }, [publisher, followedPublishers, loaded]);

  const toggleFollowed = React.useCallback(() => {
    if (!publisher) {
      return;
    }
    setFollowed((prev) => !prev);
    followPublisher(publisher);
  }, [publisher, followPublisher]);
  
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
            <ChannelIcon size={ 40 } publisher={ publisher } />
            <View>
              <Text 
                h6 
                bold>
                {publisher?.displayName}
              </Text>
              <Text subtitle2>{strings.misc_publisher}</Text>
            </View>
          </View>
          <View row />
          <View>
            <Button
              body2
              contained
              onPress={ toggleFollowed }>
              {`${ followed ? strings.action_unfollow : strings.action_follow } ${strings.misc_publisher }`}
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
