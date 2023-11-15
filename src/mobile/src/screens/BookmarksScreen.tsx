import React from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { SheetManager } from 'react-native-actions-sheet';

import {
  InteractionType,
  PublicSummaryGroup,
  ReadingFormat,
} from '~/api';
import { 
  Button,
  Icon,
  Popover,
  Screen,
  ScrollView,
  Summary,
  Text,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens';

const pageSize = 10;

export function BookmarksScreen({ navigation }: ScreenComponent<'bookmarks'>) {
  
  const { 
    bookmarkedSummaries,
    bookmarkCount,
    readSummaries,
    preferredReadingFormat, 
    setStoredValue,
    viewFeature,
    api: { interactWithSummary },
  } = React.useContext(StorageContext);
  
  const bookmarks = React.useMemo(() => Object.entries({ ...bookmarkedSummaries }), [bookmarkedSummaries]);
  
  const [unreadPage, setUnreadPage] = React.useState(0);

  const handleFormatChange = React.useCallback(
    async (summary: PublicSummaryGroup, interaction: InteractionType, format?: ReadingFormat) => {
      interactWithSummary(summary.id, InteractionType.Read, { metadata: { format } });
      navigation?.push('summary', {
        initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Bullets,
        summary,
      });
    },
    [interactWithSummary, navigation, preferredReadingFormat]
  );
  
  useFocusEffect(React.useCallback(() => {
    viewFeature('unread-bookmarks');
    navigation?.setOptions({ 
      headerRight: () => undefined,
      headerTitle: `${strings.bookmarks} (${bookmarkCount})`,
    });
  }, [bookmarkCount, navigation, viewFeature]));
  
  return (
    <Screen>
      <ScrollView pt={ 12 }>
        <View gap={ 12 }>
          <View mx={ 16 } gap={ 6 }>
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
          <View>
            {(bookmarks ?? []).slice(0, unreadPage * pageSize + pageSize)
              .map(([id, bookmark]) => {
                return (
                  <Summary
                    key={ id }
                    mx={ 12 }
                    mb={ 12 }
                    summary={ bookmark.item }
                    onFormatChange={ (format) => handleFormatChange(bookmark.item, InteractionType.Read, format) } />
                );
              })}
            {(bookmarks ?? []).length > unreadPage * pageSize + pageSize && (
              <View justifyCenter itemsCenter>
                <Button
                  beveled
                  outlined
                  selectable
                  p={ 8 }
                  m={ 8 }
                  textCenter
                  onPress={ () => setUnreadPage((prev) => prev + 1) }>
                  Load More
                </Button>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
