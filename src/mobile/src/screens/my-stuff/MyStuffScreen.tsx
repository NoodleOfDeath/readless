import React from 'react';

import {
  InteractionResponse,
  InteractionType,
  ReadingFormat,
  SummaryResponse,
} from '~/api';
import { 
  Button,
  Screen,
  Summary,
  Text,
  View,
} from '~/components';
import {
  AppStateContext,
  SessionContext,
  SummaryBookmark,
  SummaryBookmarkKey,
} from '~/contexts';
import { useSummaryClient } from '~/hooks';
import { ScreenProps } from '~/screens';

export function MyStuffScreen({ navigation }: ScreenProps<'default'>) {
  
  const { 
    preferences: {
      bookmarks, compactMode, preferredReadingFormat, 
    },
    setPreference,
  } = React.useContext(SessionContext);
  const { interactWithSummary, recordSummaryView } = useSummaryClient();
  const { setShowLoginDialog, setLoginDialogProps } = React.useContext(AppStateContext);
  
  const [bookmarkedSummaries, setBookmarkedSummaries] = React.useState<Record<string, SummaryBookmark[]>>({});
  
  React.useEffect(() => {
    const m: Record<string, SummaryBookmark[]> = {};
    Object.entries(bookmarks ?? {})
      .filter(([k, v]) => /^summary:\d+$/i.test(k) && v !== null).forEach(([_, v]) => {
        const k = new Date(v.createdAt).toDateString();
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

  const handleFormatChange = React.useCallback(
    async (summary: SummaryResponse, format?: ReadingFormat) => {
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
    <Screen>
      <View col>
        <Button 
          rounded
          selectable
          p={ 8 }
          m={ 8 }
          center
          onPress={ () => clearBookmarks() }>
          Clear Bookmarks
        </Button>
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
                    bookmarked
                    forceCompact={ compactMode }
                    forceCollapse
                    onFormatChange={ (format) => handleFormatChange(summary, format) }
                    onReferSearch={ handleReferSearch }
                    onInteract={ (...args) => handleInteraction(summary, ...args) } />
                ))}
              </View>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}
