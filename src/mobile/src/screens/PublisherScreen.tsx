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
import { StorageContext } from '~/contexts';
import { useApiClient } from '~/hooks';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens';

export function PublisherScreen({
  route,
  navigation,
}: ScreenComponent<'publisher'>) {

  const { getSummaries } = useApiClient();

  const {
    followedPublishers,
    followPublisher,
    publishers,
    publisherIsFavorited,
    favoritePublisher,
  } = React.useContext(StorageContext);

  const publisher0 = React.useMemo(() => route?.params?.publisher, [route]);
  const publisher = React.useMemo(() => publisher0 && publishers?.[publisher0.name], [publisher0, publishers]);

  const [followed, setFollowed] = React.useState((publisher?.name ?? '') in { ...followedPublishers });
  const [favorited, setFavorited] = React.useState(publisher && publisherIsFavorited(publisher));

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
  
  const toggleFavorited = React.useCallback(() => {
    if (!publisher) {
      return;
    }
    setFavorited((prev) => !prev);
    favoritePublisher(publisher);
  }, [publisher, favoritePublisher]);
  
  useFocusEffect(React.useCallback(() => {
    navigation?.setOptions({
      headerTitle: () => (
        <View flexRow gap={ 12 } itemsCenter>
          <Text 
            h6 
            bold
            adjustsFontSizeToFit>
            {publisher?.displayName}
          </Text>
        </View>
      ), 
    });
    if (!publisher) {
      return;
    }
    setFollowed(publisher.name in { ...followedPublishers });
    setFavorited(publisherIsFavorited(publisher));
  }, [followedPublishers, navigation, publisher, publisherIsFavorited]));
  
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
            <ChannelIcon rounded size={ 80 } publisher={ publisher } />
            <View flexRow gap={ 6 }>
              <Button
                body2
                contained
                haptic
                onPress={ toggleFollowed }>
                {`${ followed ? strings.action_unfollow : strings.action_follow } ${ strings.misc_publisher }`}
              </Button>
              <Button
                leftIcon={ favorited ? 'star' : 'star-outline' }
                haptic 
                iconSize={ 24 }
                onPress={ toggleFavorited }
                accessibilityLabel={ favorited ? strings.action_unfavorite : strings.action_favorite } />
            </View>
            {publisher?.description && (
              <View px={ 12 }>
                <Text body2>{publisher.description}</Text>
              </View>
            )}
          </View>
        ) } />
    </Screen>
  );
}
