import React from 'react';

import { ActivityIndicator } from 'react-native-paper';

import {
  InteractionResponse,
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import {
  Screen,
  Summary,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useSummaryClient } from '~/hooks';
import { ScreenProps } from '~/screens';

export function SummaryScreen({
  route,
  navigation,
}: ScreenProps<'summary'>) {
  const { preferences: { bookmarkedSummaries, favoritedSummaries } } = React.useContext(SessionContext);
  const { getSummary, handleInteraction } = useSummaryClient();

  const [loading, setLoading] = React.useState(false);
  const [summary, setSummary] = React.useState<PublicSummaryAttributes>();
  const [format, setFormat] = React.useState(route?.params?.initialFormat);

  const [interactions, setInteractions] = React.useState<InteractionResponse>();
  
  const handleFormatChange = React.useCallback(async (newFormat?: ReadingFormat) => {
    if (!summary || !newFormat || newFormat === format) {
      return;
    }
    const { data: interactions, error } = await handleInteraction(summary, InteractionType.Read, undefined, { format: newFormat });
    if (error) {
      console.error(error);
    } 
    if (interactions) {
      setInteractions(interactions);
    }
    setFormat(newFormat);
  }, [format, handleInteraction, summary]);
  
  const handleReferSearch = React.useCallback((prefilter: string) => {
    navigation?.push('search', { prefilter });
  }, [navigation]);

  const load = React.useCallback(async (id?: number) => {
    if (!id) {
      return;
    }
    setLoading(true);
    const { data: summary, error } = await getSummary(id);
    if (error) {
      console.error(error);
    }
    if (summary) {
      setSummary(summary);
    }
    setLoading(false);
  }, [getSummary]);

  React.useEffect(() => {
    navigation?.setOptions({ headerShown: true, headerTitle: summary?.title });
  }, [navigation, summary]);

  React.useEffect(() => {
    const summary = route?.params?.summary;
    if (typeof summary === 'number') {
      load(summary);
    } else {
      setSummary(summary);
    }
  }, [load, route?.params?.summary]);

  return (
    <Screen
      refreshing={ loading }
      onRefresh={ () => load(summary?.id) }>
      <View mt={ 10 } mh={ 16 }>
        {loading ? (
          <View alignCenter justifyCenter>
            <ActivityIndicator size="large" />
          </View>
        ) : (!!summary && (
          <Summary
            summary={ summary }
            format={ format }
            collapsible={ false }
            bookmarked={ Boolean(bookmarkedSummaries?.[summary.id]) }
            favorited={ Boolean(favoritedSummaries?.[summary.id]) }
            onFormatChange={ (format) => handleFormatChange(format) }
            onReferSearch={ handleReferSearch }
            onInteract={ (...e) => handleInteraction(summary, ...e) }
            realtimeInteractions={ interactions } />
        ))}
      </View>
    </Screen>
  );
}
