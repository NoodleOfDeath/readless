import React from 'react';

import { ActivityIndicator } from 'react-native-paper';

import {
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import {
  Screen,
  Summary,
  View,
} from '~/components';
import { useSummaryClient } from '~/hooks';
import { ScreenProps } from '~/screens';

export function SummaryScreen({
  route,
  navigation,
}: ScreenProps<'summary'>) {
  const { getSummary, handleInteraction } = useSummaryClient();

  const [loading, setLoading] = React.useState(false);
  const [reloadId, setReloadId] = React.useState(0);
  const [summary, setSummary] = React.useState<PublicSummaryAttributes>();
  const [format, setFormat] = React.useState(route?.params?.initialFormat);
  const keywords = React.useMemo(() => route?.params?.keywords ?? [], [route]);

  const handleFormatChange = React.useCallback(async (newFormat?: ReadingFormat) => {
    if (!summary || !newFormat || newFormat === format) {
      return;
    }
    handleInteraction(summary, InteractionType.Read, undefined, { format: newFormat });
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
      setReloadId(summary);
      load(summary);
    } else {
      setReloadId(summary?.id ?? 0);
      setSummary(summary);
    }
  }, [load, route?.params?.summary]);

  return (
    <Screen
      refreshing={ loading }
      onRefresh={ () => load(reloadId) }>
      <View mt={ 10 } mh={ 16 }>
        {loading ? (
          <View alignCenter justifyCenter>
            <ActivityIndicator size="large" />
          </View>
        ) : (summary && (
          <Summary
            summary={ summary }
            initialFormat={ format }
            keywords={ keywords }
            onFormatChange={ (format) => handleFormatChange(format) }
            onReferSearch={ handleReferSearch }
            onInteract={ (...e) => handleInteraction(summary, ...e) } />
        ))}
      </View>
    </Screen>
  );
}
