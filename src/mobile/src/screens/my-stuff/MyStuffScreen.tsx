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

const pageSize = 10;

export function MyStuffScreen({ navigation }: ScreenProps<'default'>) {
  
  const { 
    preferences: {
      bookmarkedSummaries,
      favoritedSummaries,
      readSummaries,
      preferredReadingFormat, 
    },
    setPreference,
  } = React.useContext(SessionContext);
  const { handleInteraction } = useSummaryClient();
  
  const [activeTab, setActiveTab] = React.useState(0);

  const unreadBookmarks = React.useMemo(() => Object.entries(bookmarkedSummaries ?? {})
    .filter(([id]) => readSummaries?.[Number(id)] === undefined), [bookmarkedSummaries, readSummaries]);
  const readBookmarks = React.useMemo(() => Object.entries(readSummaries ?? {}).sort((a, b) => a[1].createdAt < b[1].createdAt ? 1 : -1), [readSummaries]);
  const favoritedBookmarks = React.useMemo(() => Object.entries(favoritedSummaries ?? {}), [favoritedSummaries]);

  const [unreadPage, setUnreadPage] = React.useState(0);
  const [readPage, setReadPage] = React.useState(0);
  const [favoritedPage, setFavoritedPage] = React.useState(0);

  const titles = React.useMemo(() => [`Unread (${unreadBookmarks.length})`, `Read (${readBookmarks.length})`, `Favorites (${favoritedBookmarks.length})`], [unreadBookmarks, readBookmarks, favoritedBookmarks]);

  const onTabChange = React.useCallback((index: number) => {
    setActiveTab(index);
    setUnreadPage(0);
    setReadPage(0);
    setFavoritedPage(0);
  }, []);

  const handleFormatChange = React.useCallback(
    async (summary: PublicSummaryAttributes, interaction: InteractionType, format?: ReadingFormat) => {
      const { data: interactions, error } = await handleInteraction(summary, InteractionType.Read, undefined, { format });
      if (error) {
        console.error(error);
      }
      if (interactions) {
        if (activeTab === 0) {
          setPreference('bookmarkedSummaries', (prev) => {
            const bookmarks = { ...prev };
            if (bookmarks[summary.id]) {
              bookmarks[summary.id] = new Bookmark({
                ...bookmarks[summary.id].item,
                interactions,
              });
            }
            return (prev = bookmarks);
          });
        } else if (activeTab === 1) {
          setPreference('favoritedSummaries', (prev) => {
            const bookmarks = { ...prev };
            if (bookmarks[summary.id]) {
              bookmarks[summary.id] = new Bookmark({
                ...bookmarks[summary.id].item,
                interactions,
              });
            }
            return (prev = bookmarks);
          });
        }
      }
      navigation?.push('summary', {
        initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Concise,
        summary,
      });
    },
    [activeTab, handleInteraction, navigation, preferredReadingFormat, setPreference]
  );
  
  const handleReferSearch = React.useCallback((prefilter: string) => {
    navigation?.push('search', { prefilter });
  }, [navigation]);
  
  return (
    <Screen>
      <View col ph={ 16 }>
        <TabSwitcher
          activeTab={ activeTab }
          onTabChange={ onTabChange }
          titles={ titles }>
          {Object.entries(unreadBookmarks ?? {}).length === 0 ? (
            <View justifyCenter alignCenter>
              <Button
                rounded
                outlined
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
              {(unreadBookmarks ?? []).slice(0, unreadPage * pageSize + pageSize)
                .map(([id, bookmark]) => {
                  return (
                    <View col key={ id }>
                      <Summary
                        summary={ bookmark.item }
                        onFormatChange={ (format) => handleFormatChange(bookmark.item, InteractionType.Read, format) }
                        onReferSearch={ handleReferSearch }
                        onInteract={ (...args) => handleInteraction(bookmark.item, ...args) } />
                    </View>
                  );
                })}
              {(unreadBookmarks ?? []).length > unreadPage * pageSize + pageSize && (
                <View justifyCenter alignCenter>
                  <Button
                    rounded
                    outlined
                    selectable
                    p={ 8 }
                    m={ 8 }
                    center
                    onPress={ () => setUnreadPage((prev) => prev + 1) }>
                    Load More
                  </Button>
                </View>
              )}
            </View>
          )}
          <View>
            {(readBookmarks ?? []).slice(0, readPage * pageSize + pageSize)
              .map(([id, bookmark]) => {
                return (
                  <View col key={ id }>
                    <Summary
                      summary={ bookmark.item }
                      onFormatChange={ (format) => handleFormatChange(bookmark.item, InteractionType.Read, format) }
                      onReferSearch={ handleReferSearch }
                      onInteract={ (...args) => handleInteraction(bookmark.item, ...args) } />
                  </View>
                );
              })}
            {(readBookmarks ?? []).length > readPage * pageSize + pageSize && (
              <View justifyCenter alignCenter>
                <Button
                  rounded
                  outlined
                  selectable
                  p={ 8 }
                  m={ 8 }
                  center
                  onPress={ () => setReadPage((prev) => prev + 1) }>
                  Load More
                </Button>
              </View>
            )}
          </View>
          <View>
            {(favoritedBookmarks ?? []).length === 0 ? (
              <View justifyCenter alignCenter>
                <Button
                  rounded
                  outlined
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
                {(favoritedBookmarks ?? []).slice(0, favoritedPage * pageSize + pageSize)
                  .map(([id, bookmark]) => {
                    return (
                      <View col key={ id }>
                        <Summary
                          summary={ bookmark.item }
                          onFormatChange={ (format) => handleFormatChange(bookmark.item, InteractionType.Favorite, format) }
                          onReferSearch={ handleReferSearch }
                          onInteract={ (...args) => handleInteraction(bookmark.item, ...args) } />
                      </View>
                    );
                  })}
                {(favoritedBookmarks ?? []).length > favoritedPage * pageSize + pageSize && (
                  <View justifyCenter alignCenter>
                    <Button
                      rounded
                      outlined
                      selectable
                      p={ 8 }
                      m={ 8 }
                      center
                      onPress={ () => setFavoritedPage((prev) => prev + 1) }>
                      Load More
                    </Button>
                  </View>
                )}
              </View>
            )}
          </View>
        </TabSwitcher>
      </View>
    </Screen>
  );
}
