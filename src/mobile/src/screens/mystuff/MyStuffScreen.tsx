import React from 'react';

import { RouteProp } from '@react-navigation/native';

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
      readSummaries,
      preferredReadingFormat, 
      summaryHistory,
    },
    setPreference,
  } = React.useContext(SessionContext);
  const { handleInteraction } = useSummaryClient();
  
  const [refreshing, setRefreshing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  const bookmarks = React.useMemo(() => Object.entries({ ...bookmarkedSummaries }), [bookmarkedSummaries]);
  const history = React.useMemo(() => Object.entries({ ...summaryHistory }).sort((a, b) => a[1].createdAt < b[1].createdAt ? 1 : -1), [summaryHistory]);
  
  const [unreadPage, setUnreadPage] = React.useState(0);

  const titles = React.useMemo(() => [`Bookmarks (${bookmarks.length})`, `Activity (${history.length})` ], [bookmarks, history]);

  const historyRoute = React.useMemo<RouteProp<StackableTabParams, 'search'>>(() => ({
    key: 'read',
    name: 'search',
    params: { 
      noHeader: true,
      onlyCustomNews: false,
      specificIds: history.map(([id]) => Number(id)),
    },
  }), [history]);

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
                    autoAnchor={
                      <Icon size={ 24 } name="information" />
                    }>
                    <Text>Note: The original ariticles themselves are not saved for offline reading.</Text>
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
                    Removed Read from Bookmarks
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
          <View>
            {history.length === 0 ? (
              <View justifyCenter alignCenter>
                <Button
                  rounded
                  outlined
                  selectable
                  p={ 8 }
                  m={ 8 }
                  textCenter
                  onPress={ () => navigation?.getParent()?.navigate('search') }>
                  Read Articles
                </Button>
              </View>
            ) : (
              !refreshing && (
                <SearchScreen
                  route={ historyRoute }
                  navigation={ navigation } />
              )
            )}
          </View>
        </TabSwitcher>
      </View>
    </Screen>
  );
}
