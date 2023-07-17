import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
  BackNavigation,
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
  
  useFocusEffect(React.useCallback(() => {
    navigation?.setOptions({
      header: () => (
        <View 
          row 
          itemsCenter
          elevated
          gap={ 6 }
          zIndex={ 100 }
          height={ publisher?.description ? 120 : 80 } 
          p={ 12 }>
          <BackNavigation />
          <View row>
            <View flexRow gap={ 6 } itemsCenter>
              <ChannelIcon size={ 40 } publisher={ publisher } />
              <View>
                <Text 
                  h6
                  bold>
                  {publisher?.displayName}
                </Text>
                <Text subtitle2>{strings.misc_publisher}</Text>
              </View>
              <View row />
              <View>
                <Button
                  body2
                  contained
                  haptic
                  adjustsFontSizeToFit
                  onPress={ toggleFollowed }>
                  {`${ followed ? strings.action_unfollow : strings.action_follow } ${ publisher?.displayName && publisher.displayName.length < 15 ? strings.misc_publisher : '' }`}
                </Button>
              </View>
            </View>
          </View>
          {publisher?.description && (
            <React.Fragment>
              <Divider />
              <Text>{publisher.description}</Text>
            </React.Fragment>
          )}
        </View>
      ),
    });
  }, [navigation, publisher, toggleFollowed, followed]));
  
  return (
    <Screen>
      <SummaryList
        fetch={ getSummaries }
        filter={ prefilter } />
    </Screen>
  );
}
