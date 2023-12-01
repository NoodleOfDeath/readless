import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { 
  Button,
  Screen,
  SummaryList,
  Text,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { strings } from '~/locales';

export function BookmarksScreen() {
  
  const { 
    bookmarkedSummaries,
    bookmarkCount,
    readSummaries,
    setStoredValue,
  } = React.useContext(StorageContext);

  const [bookmarks, setBookmarks] = React.useState(Object.values({ ...bookmarkedSummaries }).map((b) => b.item).sort((a, b) => new Date(b.createdAt ?? Date.now()).valueOf() - new Date(a.createdAt ?? Date.now()).valueOf()));
  
  useFocusEffect(React.useCallback(() => {
    setBookmarks(Object.values({ ...bookmarkedSummaries }).map((b) => b.item));
  }, [bookmarkedSummaries]));
  
  return (
    <Screen>
      <View gap={ 12 } flex={ 1 }>
        {bookmarkCount === 0 ? (
          <Text textCenter p={ 12 }>{strings.youHaveNoBookmarks}</Text>
        ) : (
          <SummaryList
            headerComponent={ (
              <View flex={ 1 } m={ 16 } gap={ 6 }>
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
            ) }
            summaries={ bookmarks } />
        )}
      </View>
    </Screen>
  );
}
