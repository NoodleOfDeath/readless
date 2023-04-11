import React from 'react';

import {
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import { 
  Button,
  Screen,
  Summary,
  TabSwitcher,
  View,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { useSummaryClient } from '~/hooks';
import { ScreenProps } from '~/screens';

export function MyStuffScreen({ navigation }: ScreenProps<'default'>) {
  
  const { 
    preferences: {
      bookmarkedSummaries,
      favoritedSummaries,
      compactMode, 
      preferredReadingFormat, 
    },
    setPreference,
  } = React.useContext(SessionContext);
  const { handleInteraction } = useSummaryClient();
  
  const [activeTab, setActiveTab] = React.useState(0);
  
  const clearBookmarkedSummaries = React.useCallback(() => {
    setPreference('bookmarkedSummaries', {});
  }, [setPreference]);

  const handleFormatChange = React.useCallback(
    async (summary: PublicSummaryAttributes, interaction: InteractionType, format?: ReadingFormat) => {
      const { data: interactions, error } = await handleInteraction(summary, InteractionType.Read, undefined, { format });
      if (error) {
        return;
      }
      if (interactions) {
        if (interaction === InteractionType.Bookmark) {
          setPreference('bookmarkedSummaries', (prev) => {
            const bookmarks = { ...prev };
            if (bookmarks[summary.id]) {
              delete bookmarks[summary.id];
            } else {
              bookmarks[summary.id] = new Bookmark({ ...summary, interactions });
            }
            return bookmarks;
          });
        } else if (interaction === InteractionType.Favorite) {
          setPreference('favoritedSummaries', (prev) => {
            const favorites = { ...prev };
            if (favorites[summary.id]) {
              delete favorites[summary.id];
            } else {
              favorites[summary.id] = new Bookmark({ ...summary, interactions });
            }
            return favorites;
          });
        }
      }
      navigation?.push('summary', {
        initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Concise,
        summary,
      });
    },
    [handleInteraction, navigation, preferredReadingFormat, setPreference]
  );
  
  const handleReferSearch = React.useCallback((prefilter: string) => {
    navigation?.push('search', { prefilter });
  }, [navigation]);
  
  return (
    <Screen>
      <View col mh={ 16 }>
        <TabSwitcher
          activeTab={ activeTab }
          onTabChange={ setActiveTab }
          titles={ ['Bookmarks', 'Favorites'] }>
          <View>
            {Object.entries(bookmarkedSummaries ?? {}).length === 0 ? (
              <View justifyCenter alignCenter>
                <Button
                  rounded
                  outlined
                  small
                  selectable
                  p={ 8 }
                  m={ 8 }
                  center
                  onPress={ () => navigation?.getParent()?.navigate('search') }>
                  Search for Articles
                </Button>
              </View>
            ) : (
              <View>
                <Button 
                  rounded
                  small
                  selectable
                  p={ 8 }
                  m={ 8 }
                  center
                  onPress={ () => clearBookmarkedSummaries() }>
                  Clear Bookmarks
                </Button>
                {Object.entries(bookmarkedSummaries ?? {}).map(([id, bookmark]) => {
                  return (
                    <View col key={ id }>
                      <Summary
                        summary={ bookmark.item }
                        bookmarked
                        favorited={ Boolean(favoritedSummaries?.[bookmark.item.id]) }
                        compact={ compactMode }
                        onFormatChange={ (format) => handleFormatChange(bookmark.item, InteractionType.Bookmark, format) }
                        onReferSearch={ handleReferSearch }
                        onInteract={ (...args) => handleInteraction(bookmark.item, ...args) } />
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          <View>
            {Object.entries(favoritedSummaries ?? {}).length === 0 ? (
              <View justifyCenter alignCenter>
                <Button
                  rounded
                  outlined
                  small
                  selectable
                  p={ 8 }
                  m={ 8 }
                  center
                  onPress={ () => navigation?.getParent()?.navigate('search') }>
                  Search for Articles
                </Button>
              </View>
            ) : (
              <View>
                {Object.entries(favoritedSummaries ?? {}).map(([id, bookmark]) => {
                  return (
                    <View col key={ id }>
                      <Summary
                        summary={ bookmark.item }
                        bookmarked={ Boolean(bookmarkedSummaries?.[bookmark.item.id]) }
                        favorited
                        compact={ compactMode }
                        onFormatChange={ (format) => handleFormatChange(bookmark.item, InteractionType.Favorite, format) }
                        onReferSearch={ handleReferSearch }
                        onInteract={ (...args) => handleInteraction(bookmark.item, ...args) } />
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </TabSwitcher>
      </View>
    </Screen>
  );
}
