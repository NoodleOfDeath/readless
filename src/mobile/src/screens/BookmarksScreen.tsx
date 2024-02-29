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
    api: { getSummaries },
    bookmarkedSummaries,
    bookmarkCount,
    readSummaries,
    setStoredValue,
  } = React.useContext(StorageContext);

  const [bookmarks, setBookmarks] = React.useState((Object.entries({ ...bookmarkedSummaries }).sort((a, b) => new Date(b[1].createdAt ?? Date.now()).valueOf() - new Date(a[1].createdAt ?? Date.now()).valueOf())).map(([id]) => parseInt(id)));
  
  useFocusEffect(React.useCallback(() => {
    setBookmarks((Object.entries({ ...bookmarkedSummaries }).sort((a, b) => new Date(b[1].createdAt ?? Date.now()).valueOf() - new Date(a[1].createdAt ?? Date.now()).valueOf())).map(([id]) => parseInt(id)));
  }, [bookmarkedSummaries]));

  return (
    <Screen>
      <View gap={ 12 } flex={ 1 }>
        {bookmarkCount === 0 ? (
          <Text textCenter p={ 12 }>{strings.youHaveNoBookmarks}</Text>
        ) : (
          <SummaryList
            fetch={ getSummaries }
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
            specificIds={ bookmarks } />
        )}
      </View>
    </Screen>
  );
}
