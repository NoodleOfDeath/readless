import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
  Button,
  Divider,
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
  navigation,
}: ScreenProps<'publisher'>) {

  const { getSummaries } = useSummaryClient();

  const {
    followedPublishers,
    followPublisher,
  } = React.useContext(SessionContext);

  const publisher = React.useMemo(() => route?.params?.publisher, [route]);

  const [followed, setFollowed] = React.useState((publisher?.name ?? '') in { ...followedPublishers });

  const prefilter = React.useMemo(() => {
    if (!publisher) {
      return undefined;
    }
    return `pub:${publisher.name}`;
  }, [publisher]);

  const toggleFollowed = React.useCallback(() => {
    if (!publisher) {
      return;
    }
    setFollowed((prev) => !prev);
    followPublisher(publisher);
  }, [publisher, followPublisher]);
  
  useFocusEffect(React.useCallback(() => {
    navigation?.setOptions({ headerTitle: '' });
    if (!publisher) {
      return;
    }
    setFollowed(publisher.name in { ...followedPublishers });
  }, [followedPublishers, navigation, publisher]));
  
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
            <ChannelIcon rounded size={ 40 } publisher={ publisher } />
            <Text 
              h6 
              ml={ 6 }
              bold>
              {publisher?.displayName}
            </Text>
            {publisher?.description && (
              <React.Fragment>
                <Divider />
                <Text>{publisher.description}</Text>
              </React.Fragment>
            )}
            <View>
              <Button
                body2
                contained
                haptic
                onPress={ toggleFollowed }>
                {`${ followed ? strings.action_unfollow : strings.action_follow } ${ strings.misc_publisher }`}
              </Button>
            </View>
          </View>
        ) } />
    </Screen>
  );
}
