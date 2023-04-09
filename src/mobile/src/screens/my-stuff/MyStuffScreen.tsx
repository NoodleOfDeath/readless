import React from 'react';

import {
  InteractionResponse,
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import { 
  Button,
  Screen,
  Summary,
  TabSwitcher,
  Text,
  View,
} from '~/components';
import { window } from '~/constants';
import {
  AppStateContext,
  Bookmark,
  SessionContext,
} from '~/contexts';
import { useSummaryClient } from '~/hooks';
import { ScreenProps } from '~/screens';

export function MyStuffScreen({ navigation }: ScreenProps<'default'>) {
  
  const { 
    preferences: {
      bookmarkedCategories,
      bookmarkedOutlets,
      bookmarkedSummaries,
      compactMode, 
      preferredReadingFormat, 
    },
    setPreference,
  } = React.useContext(SessionContext);
  const { interactWithSummary, recordSummaryView } = useSummaryClient();
  const { setShowLoginDialog, setLoginDialogProps } = React.useContext(AppStateContext);
  
  const [activeTab, setActiveTab] = React.useState(0);
  
  const categoryCount = React.useMemo(() => Object.values(bookmarkedCategories ?? {}).length, [bookmarkedCategories]);
  const outletCount = React.useMemo(() => Object.values(bookmarkedOutlets ?? {}).length, [bookmarkedOutlets]);
  
  const clearBookmarkedSummaries = React.useCallback(() => {
    setPreference('bookmarkedSummaries', {});
  }, [setPreference]);

  const handleFormatChange = React.useCallback(
    async (summary: PublicSummaryAttributes, format?: ReadingFormat) => {
      recordSummaryView(summary, undefined, { format });
      navigation?.push('summary', {
        initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Concise,
        summary,
      });
    },
    [navigation, preferredReadingFormat, recordSummaryView]
  );
  
  const handleReferSearch = React.useCallback((prefilter: string) => {
    navigation?.push('search', { prefilter });
  }, [navigation]);

  const updateInteractions = React.useCallback((summary: PublicSummaryAttributes, interactions: InteractionResponse) => {
    setPreference('bookmarkedSummaries', (prev) => {
      const newBookmarks = { ...prev };
      if (!newBookmarks[summary.id]) {
        return (prev = newBookmarks);
      }
      newBookmarks[summary.id].summary.interactions = interactions;
      return (prev = newBookmarks);
    });
  }, [setPreference]);
  
  const handleInteraction = React.useCallback(async (summary: PublicSummaryAttributes, interaction: InteractionType, content?: string, metadata?: Record<string, unknown>) => {
    if (interaction === InteractionType.Bookmark) {
      setPreference('bookmarkedSummaries', (prev) => {
        const bookmarks = { ...prev };
        if (bookmarks[summary.id]) {
          delete bookmarks[summary.id];
        } else {
          bookmarks[summary.id] = new Bookmark(summary);
        }
        return (prev = bookmarks);
      });
      return;
    }
    const { data, error } = await interactWithSummary(
      summary, 
      interaction,
      content,
      metadata
    );
    if (error) {
      console.error(error);
      if (error.name === 'NOT_LOGGED_IN') {
        setShowLoginDialog(true);
        setLoginDialogProps({ alert: 'Please log in to continue' });
      }
      return;
    }
    if (!data) {
      return;
    }
    updateInteractions(summary, data);
  }, [interactWithSummary, updateInteractions, setPreference, setShowLoginDialog, setLoginDialogProps]);
  
  return (
    <Screen>
      <View col>
        <TabSwitcher
          activeTab={ activeTab }
          onTabChange={ setActiveTab }
          titles={ ['Following', 'Bookmarks'] }>
          <View>
            {categoryCount + outletCount === 0 ? (
              <View>
                <Text 
                  center
                  fontSize={ 20 }
                  mb={ 8 }>
                  Looks like you are not following any categories or news sources.
                </Text>
                <View alignCenter justifyCenter>
                  <Button 
                    center
                    outlined 
                    rounded
                    p={ 8 }
                    mb={ 8 }
                    onPress={ () => navigation?.getParent()?.jumpTo('Sections') }>
                    Go to the Sections tab
                  </Button>
                </View>
                <Text 
                  center
                  fontSize={ 20 }
                  mb={ 8 }>
                  to custom select the categories and sources you would only like to see then come back here!
                </Text>
              </View>
            ) : (
              <View>
                <Text>{JSON.stringify(bookmarkedCategories)}</Text>
                <Text>{JSON.stringify(bookmarkedOutlets)}</Text>
              </View>
            )}
          </View>
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
                    forceCompact={ compactMode }
                    forceCollapse
                    onFormatChange={ (format) => handleFormatChange(bookmark.item, format) }
                    onReferSearch={ handleReferSearch }
                    onInteract={ (...args) => handleInteraction(bookmark.item, ...args) } />
                </View>
              );
            })}
          </View>
        </TabSwitcher>
      </View>
    </Screen>
  );
}
