import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  InteractionResponse,
  InteractionType,
  ReadingFormat,
} from '~/api';
import {
  SafeScrollView,
  Summary,
  View,
} from '~/components';
import {
  AppStateContext,
  SessionContext,
  SummaryBookmark,
  SummaryBookmarkKey,
} from '~/contexts';
import { useSummaryClient } from '~/hooks';
import { RootParamList } from '~/screens';

type Props = {
  route: 
    | RouteProp<RootParamList['myStuffTab'], 'summary'>
    | RouteProp<RootParamList['newsTab'], 'summary'>
    | RouteProp<RootParamList['realtimeTab'], 'summary'>;
  navigation: 
    | NativeStackNavigationProp<RootParamList['myStuffTab'], 'summary'>
    | NativeStackNavigationProp<RootParamList['newsTab'], 'summary'>
    | NativeStackNavigationProp<RootParamList['searchTab'], 'summary'>;
};

export function SummaryScreen({
  route: { params: { summary, initialFormat } },
  navigation,
}: Props) {
  const {
    setScreenOptions, setShowLoginDialog, setLoginDialogProps, 
  } = React.useContext(AppStateContext);
  const { 
    preferences: { bookmarks },
    setPreference,
  } = React.useContext(SessionContext);
  const { interactWithSummary, recordSummaryView } = useSummaryClient();

  const [format, setFormat] = React.useState(initialFormat);
  const [interactions, setInteractions] = React.useState<InteractionResponse>(summary.interactions);

  React.useEffect(() => {
    navigation.setOptions({ headerTitle: summary.title });
    setScreenOptions((prev) => ({
      ...prev,
      headerShown: false,
    }));
  }, [navigation, setScreenOptions, summary]);
  
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
    <SafeScrollView>
      <View mt={ 10 }>
        {summary && (
          <Summary
            summary={ summary }
            format={ format }
            collapsible={ false }
            forceCompact={ false }
            bookmarked={ Boolean(bookmarks?.[`summary:${summary.id}`]) }
            onFormatChange={ (format) => handleFormatChange(format) }
            onReferSearch={ handleReferSearch }
            onInteract={ onInteract }
            realtimeInteractions={ interactions } />
        )}
      </View>
    </SafeScrollView>
  );
}
