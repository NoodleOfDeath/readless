import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { 
  Button,
  Icon,
  Popover,
  Screen,
  SummaryList,
  Text,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens';

export function BookmarksScreen({ navigation }: ScreenComponent<'bookmarks'>) {
  
  const { 
    bookmarkedSummaries,
    bookmarkCount,
    readSummaries,
    setStoredValue,
    viewFeature,
  } = React.useContext(StorageContext);

  const [bookmarks, setBookmarks] = React.useState(Object.values({ ...bookmarkedSummaries }).map((b) => b.item));
  
  useFocusEffect(React.useCallback(() => {
    viewFeature('unread-bookmarks');
    setBookmarks(Object.values({ ...bookmarkedSummaries }).map((b) => b.item));
    navigation?.setOptions({ 
      headerRight: () => undefined,
      headerTitle: `${strings.bookmarks} (${bookmarkCount})`,
    });
  }, [bookmarkCount, bookmarkedSummaries, navigation, viewFeature]));
  
  return (
    <Screen>
      <View gap={ 12 } flex={ 1 }>
        <SummaryList
          headerComponent={ (
            <View flex={ 1 } m={ 16 } gap={ 6 }>
              <View row gap={ 6 }>
                <Text>
                  {strings.bookmarks}
                </Text>
                <Popover
                  anchor={
                    <Icon size={ 24 } name="information" />
                  }>
                  <Text>{strings.bookmarks}</Text>
                </Popover>
              </View>
              <View row>
                <Button
                  contained
                  beveled
                  p={ 6 }
                  onPress={ () => setStoredValue('bookmarkedSummaries', (prev) => {
                    const state = { ...prev };
                    for (const [id] of Object.entries(state)) {
                      if (id in (readSummaries ?? {})) {
                        delete state[Number(id)];
                      }
                    }
                    return state;
                  }) }>
                  {strings.removeReadBookmarks}
                </Button>
              </View>
            </View>
          ) }
          summaries={ bookmarks } />
      </View>
    </Screen>
  );
}
