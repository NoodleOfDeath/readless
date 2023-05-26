import React from 'react';

import {
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import { 
  Button,
  Icon,
  Menu,
  Screen,
  ScrollView,
  Summary,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useSummaryClient } from '~/hooks';
import { strings } from '~/locales';
import { ScreenProps } from '~/screens';

const pageSize = 10;

export function BookmarksScreen({ navigation }: ScreenProps<'bookmarks'>) {
  
  const { 
    preferences: {
      bookmarkedSummaries,
      readSummaries,
      preferredReadingFormat, 
    },
    setPreference,
  } = React.useContext(SessionContext);
  const { handleInteraction } = useSummaryClient();
  
  const bookmarks = React.useMemo(() => Object.entries({ ...bookmarkedSummaries }), [bookmarkedSummaries]);
  
  const [unreadPage, setUnreadPage] = React.useState(0);

  const handleFormatChange = React.useCallback(
    async (summary: PublicSummaryAttributes, interaction: InteractionType, format?: ReadingFormat) => {
      handleInteraction(summary, InteractionType.Read, undefined, { format });
      navigation?.push('summary', {
        initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Summary,
        summary,
      });
    },
    [handleInteraction, navigation, preferredReadingFormat]
  );
  
  React.useEffect(() => {
    navigation?.setOptions({ headerRight: () => undefined });
  }, [navigation]);
  
  return (
    <Screen>
      <ScrollView pt={ 12 }>
        {Object.entries(bookmarks ?? {}).length === 0 ? (
          <View justifyCenter alignCenter>
            <Button
              rounded
              outlined
              selectable
              p={ 8 }
              m={ 8 }
              textCenter
              onPress={ () => navigation?.getParent()?.navigate('search') }>
              {strings.browse}
            </Button>
          </View>
        ) : (
          <View gap={ 12 }>
            <View mh={ 16 } gap={ 6 }>
              <View row gap={ 6 }>
                <Text>
                  {strings.bookmarks.bookmarksDetail}
                </Text>
                <Menu
                  autoAnchor={
                    <Icon size={ 24 } name="information" />
                  }>
                  <Text>{strings.bookmarks.bookmarksNote}</Text>
                </Menu>
              </View>
              <View row>
                <Button
                  elevated
                  rounded
                  p={ 6 }
                  onPress={ () => setPreference('bookmarkedSummaries', (prev) => {
                    const state = { ...prev };
                    for (const [id] of Object.entries(state)) {
                      if (id in (readSummaries ?? {})) {
                        delete state[Number(id)];
                      }
                    }
                    return (prev = state);
                  }) }>
                  {strings.bookmarks.removeReadFromBookmarks}
                </Button>
              </View>
            </View>
            <View>
              {(bookmarks ?? []).slice(0, unreadPage * pageSize + pageSize)
                .map(([id, bookmark]) => {
                  return (
                    <Summary
                      key={ id }
                      summary={ bookmark.item }
                      onFormatChange={ (format) => handleFormatChange(bookmark.item, InteractionType.Read, format) }
                      onInteract={ (...args) => handleInteraction(bookmark.item, ...args) } />
                  );
                })}
              {(bookmarks ?? []).length > unreadPage * pageSize + pageSize && (
                <View justifyCenter alignCenter>
                  <Button
                    rounded
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
        )}
      </ScrollView>
    </Screen>
  );
}
