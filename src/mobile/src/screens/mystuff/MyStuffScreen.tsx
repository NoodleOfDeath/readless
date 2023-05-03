import React from 'react';

import { RouteProp } from '@react-navigation/native';

import {
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import { 
  Button,
  Menu,
  Screen,
  Summary,
  TabSwitcher,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useSummaryClient } from '~/hooks';
import {
  ScreenProps,
  SearchScreen,
  StackableTabParams,
} from '~/screens';

const pageSize = 10;

export function MyStuffScreen({ navigation }: ScreenProps<'search'>) {
  
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
  
  const [refreshing, setRefreshing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  const bookmarks = React.useMemo(() => Object.entries(bookmarkedSummaries ?? {}), [bookmarkedSummaries]);
  const readBookmarks = React.useMemo(() => Object.entries(readSummaries ?? {}).sort((a, b) => a[1].createdAt < b[1].createdAt ? 1 : -1), [readSummaries]);
  const favoritedBookmarks = React.useMemo(() => Object.entries(favoritedSummaries ?? {}), [favoritedSummaries]);

  const [unreadPage, setUnreadPage] = React.useState(0);
  const [showInfoMenu, setShowInfoMenu] = React.useState(false);

  const titles = React.useMemo(() => [`Bookmarks (${bookmarks.length})`, `Favorites (${favoritedBookmarks.length})`, `Read (${readBookmarks.length})` ], [bookmarks, readBookmarks, favoritedBookmarks]);

  const routes = React.useMemo<RouteProp<StackableTabParams, 'search'>[]>(() => [
    {
      key: 'favorited',
      name: 'search',
      params: { 
        onlyCustomNews: true,
        specificIds: favoritedBookmarks.map(([id]) => Number(id)), 
      },
    },
    {
      key: 'read',
      name: 'search',
      params: { 
        onlyCustomNews: false,
        specificIds: readBookmarks.map(([id]) => Number(id)),
      },
    },
  ], [favoritedBookmarks, readBookmarks]);

  const onTabChange = React.useCallback((index: number) => {
    setActiveTab(index);
    setUnreadPage(0);
  }, []);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 100);
  };

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
  
  const handleReferSearch = React.useCallback((prefilter: string) => {
    navigation?.push('search', { prefilter });
  }, [navigation]);
  
  return (
    <Screen 
      refreshing={ refreshing }
      onRefresh={ refresh }>
      <View col>
        <TabSwitcher
          tabHeight={ 48 }
          activeTab={ activeTab }
          onTabChange={ onTabChange }
          titles={ titles }>
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
                Search for Articles
              </Button>
            </View>
          ) : (
            <View gap={ 12 }>
              <View mh={ 16 } gap={ 6 }>
                <View row gap={ 6 }>
                  <Text>
                    Bookmarks are always available offline
                  </Text>
                  <Menu
                    visible={ showInfoMenu }
                    onDismiss={ () => setShowInfoMenu(false) }
                    anchor={
                      <Button iconSize={ 24 } startIcon="information" onPress={ () => setShowInfoMenu(true) } />
                    }>
                    <Text>This image was generated using AI and is not a real photo of a real event, place, thing, or person.</Text>
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
                    Removed Read Bookmarks
                  </Button>
                </View>
              </View>
              {(bookmarks ?? []).slice(0, unreadPage * pageSize + pageSize)
                .map(([id, bookmark]) => {
                  return (
                    <Summary
                      key={ id }
                      summary={ bookmark.item }
                      onFormatChange={ (format) => handleFormatChange(bookmark.item, InteractionType.Read, format) }
                      onReferSearch={ handleReferSearch }
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
          )}
          <View>
            {favoritedBookmarks.length === 0 ? (
              <View justifyCenter alignCenter>
                <Button
                  rounded
                  outlined
                  selectable
                  p={ 8 }
                  m={ 8 }
                  textCenter
                  onPress={ () => navigation?.getParent()?.navigate('search') }>
                  Search for Articles
                </Button>
              </View>
            ) : (
              !refreshing && (
                <SearchScreen
                  route={ routes[0] }
                  navigation={ navigation } />
              )
            )}
          </View>
          <View>
            {!refreshing && (
              <SearchScreen
                route={ routes[1] }
                navigation={ navigation } />
            )}
          </View>
        </TabSwitcher>
      </View>
    </Screen>
  );
}
