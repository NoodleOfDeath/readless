import React from 'react';

import {
  InteractionResponse,
  InteractionType,
  ReadingFormat,
} from '~/api';
import {
  Screen,
  Summary,
  View,
} from '~/components';
import {
  AppStateContext,
  Bookmark,
  SessionContext,
} from '~/contexts';
import { useSummaryClient } from '~/hooks';
import { ScreenProps } from '~/screens';

export function SummaryScreen({
  route: { params: { summary, initialFormat } },
  navigation,
}: ScreenProps<'summary'>) {
  const { setShowLoginDialog, setLoginDialogProps } = React.useContext(AppStateContext);
  const { 
    preferences: { bookmarkedSummaries },
    setPreference,
  } = React.useContext(SessionContext);
  const { interactWithSummary, recordSummaryView } = useSummaryClient();

  const [format, setFormat] = React.useState(initialFormat);
  const [interactions, setInteractions] = React.useState<InteractionResponse>(summary.interactions);

  React.useEffect(() => {
    navigation.setOptions({ headerShown: true, headerTitle: summary.title });
  }, [navigation, summary]);
  
  const handleFormatChange = React.useCallback(async (newFormat?: ReadingFormat) => {
    if (!newFormat || newFormat === format) {
      return;
    }
    recordSummaryView(summary, undefined, { format: newFormat });
    setFormat(newFormat);
  }, [format, recordSummaryView, summary]);
  
  const handleReferSearch = React.useCallback((prefilter: string) => {
    navigation?.push('search', { prefilter });
  }, [navigation]);
  
  const onInteract = React.useCallback(async (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>) => {
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
    } else if (interaction === InteractionType.Favorite) {
      setPreference('favoritedSummaries', (prev) => {
        const favorites = { ...prev };
        if (favorites[summary.id]) {
          delete favorites[summary.id];
        } else {
          favorites[summary.id] = new Bookmark(summary);
        }
        return (prev = favorites);
      });
      return;
    } else if (interaction === InteractionType.Share && summary.categoryAttributes?.name) {
      const shareUrl = `${BASE_DOMAIN}/read/?s=${summary.id}`;
      await Share.share({ url: shareUrl });
      return;
    }
    const { data, error } = await interactWithSummary(summary, interaction, content, metadata);
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
    setInteractions(data);
  }, [interactWithSummary, setLoginDialogProps, setPreference, setShowLoginDialog, summary]);

  return (
    <Screen>
      <View mt={ 10 }>
        {summary && (
          <Summary
            summary={ summary }
            format={ format }
            collapsible={ false }
            bookmarked={ Boolean(bookmarkedSummaries?.[summary.id]) }
            onFormatChange={ (format) => handleFormatChange(format) }
            onReferSearch={ handleReferSearch }
            onInteract={ onInteract }
            realtimeInteractions={ interactions } />
        )}
      </View>
    </Screen>
  );
}
