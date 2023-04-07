import React from 'react';

import {
  InteractionResponse,
  InteractionType,
  SummaryResponse,
} from '~/api';
import { 
  Button,
  SafeScrollView,
  Summary,
  Text,
  View,
} from '~/components';
import AnimatedTabBar from '~/components/common/AnimatedTabBar';
import {
  AppStateContext,
  SessionContext,
  SummaryBookmark,
  SummaryBookmarkKey,
} from '~/contexts';
import { useSummaryClient } from '~/hooks';

export function MyStuffScreen() {
  
  const { 
    preferences: { bookmarks },
    setPreference,
  } = React.useContext(SessionContext);
  const { interactWithSummary } = useSummaryClient();
  const { setShowLoginDialog, setLoginDialogProps } = React.useContext(AppStateContext);
  
  const [bookmarkedSummaries, setBookmarkedSummaries] = React.useState<Record<string, SummaryBookmark[]>>({});
  
  React.useEffect(() => {
    const m: Record<string, SummaryBookmark[]> = {};
    Object.entries(bookmarks ?? {})
      .filter(([_, v]) => v instanceof SummaryBookmark).forEach(([_, v]) => {
        const k = v.createdAt.toDateString();
        if (!m[k]) {
          m[k] = [];
        }
        m[k].push(v);
      });
    setBookmarkedSummaries(m);
  }, [bookmarks]);
  
  const clearBookmarks = React.useCallback(() => {
    setPreference('bookmarks', {});
  }, [setPreference]);

  const updateInteractions = React.useCallback((summary: SummaryResponse, interactions: InteractionResponse) => {
    setPreference('bookmarks', (prev) => {
      const newBookmarks = { ...prev };
      const key: SummaryBookmarkKey = `summary:${summary.id}`;
      if (!newBookmarks[key]) {
        return (prev = newBookmarks);
      }
      newBookmarks[key].summary.interactions = interactions;
      return (prev = newBookmarks);
    });
  }, [setPreference]);
  
  const handleInteraction = React.useCallback(async (summary: SummaryResponse, interaction: InteractionType, content?: string, metadata?: Record<string, unknown>) => {
    if (interaction === InteractionType.Bookmark) {
      setPreference('bookmarks', (prev) => {
        const bookmarks = { ...prev };
        const key: SummaryBookmarkKey = `summary:${summary.id}`;
        if (bookmarks[key]) {
          delete bookmarks[key];
        } else {
          bookmarks[key] = new SummaryBookmark(summary);
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
    <SafeScrollView>
      <View col p={ 8 }>
        <Button 
          rounded
          selectable
          p={ 8 }
          mb={ 8 }
          center
          onPress={ () => clearBookmarks() }>
          Clear Bookmarks
        </Button>
        <AnimatedTabBar>
          <View>
            <Text fontSize={ 16 } p={ 8 }>Bookmarked Articles</Text>
            {Object.entries(bookmarkedSummaries).map(([date, bookmarks]) => {
              return (
                <View col key={ date }>
                  <Text right p={ 8 }>{ new Date(date).toDateString() }</Text>
                  {bookmarks.map(({ summary }) => (
                    <Summary 
                      key={ summary.id } 
                      summary={ summary }
                      onInteract={ (...args) => handleInteraction(summary, ...args) }
                      bookmarked
                      forceCollapse />
                  ))}
                </View>
              );
            })}
          </View>
        </AnimatedTabBar>
      </View>
    </SafeScrollView>
  );
}
