import React from 'react';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PublicCategoryAttributes, PublicPublisherAttributes } from '~/api';
import {
  Button,
  Chip,
  Icon,
  Image,
  Screen,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useTheme } from '~/hooks';
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

  const theme = useTheme();

  const {
    followedPublishers,
    followedCategories,
    followPublisher,
    followCategory,
  } = React.useContext(SessionContext);

  const type = React.useMemo(() => route?.params?.type, [route]);
  const attributes = React.useMemo(() => route?.params?.attributes, [route]);

  const [followed, setBookmarked] = React.useState(false);
  
  React.useEffect(() => {
    if (!attributes) {
      return;
    }
    type === 'category' ? 
      setBookmarked(attributes.name in (followedCategories ?? {})) :
      setBookmarked(attributes.name in (followedPublishers ?? {}));
  }, [attributes, type, followedCategories, followedPublishers]);

  const prefilter = React.useMemo(() => {
    if (!attributes) {
      return undefined;
    }
    switch (type) {
    case 'category':
      return `cat:${attributes.name}`;
    case 'publisher':
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
      followPublisher(attributes);
  }, [attributes, type, followCategory, followPublisher]);
  
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
            <View
              borderRadius={ 6 }
              overflow="hidden">
              { type === 'category' && (
                <Icon name={ (attributes as PublicCategoryAttributes).icon } size={ 24 } />
              )}
              { type === 'publisher' && (
                <Image 
                  fallbackComponent={ (
                    <Chip
                      bg={ theme.colors.primaryLight }
                      color={ theme.colors.contrastText }
                      itemsCenter
                      justifyCenter
                      textCenter
                      h5
                      width={ 40 }
                      height={ 40 }>
                      {attributes?.displayName[0]}
                    </Chip>
                  ) }
                  source={ { uri: `https://readless.nyc3.cdn.digitaloceanspaces.com/img/pub/${(attributes as PublicPublisherAttributes).name}.png` } }
                  width={ 40 }
                  height={ 40 } />
              )}
            </View>
            <View>
              <Text 
                h6 
                bold
                uppercase>
                {attributes?.displayName}
              </Text>
              <Text subtitle2>{type === 'category' ? strings.misc_category : strings.misc_publisher}</Text>
            </View>
          </View>
          <View row />
          <View>
            <Button
              body2
              contained
              onPress={ toggleBookmarked }>
              {`${ followed ? strings.action_unfollow : strings.action_follow } ${ type === 'category' ? strings.misc_category : strings.misc_publisher }`}
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
