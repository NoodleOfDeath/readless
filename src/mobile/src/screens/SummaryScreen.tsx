import React from 'react';

import { ActivityIndicator } from 'react-native-paper';

import {
  InteractionType,
  PublicSummaryAttributes,
  PublicSummaryGroup,
  ReadingFormat,
} from '~/api';
import {
  Divider,
  FlatList,
  Screen,
  Summary,
  View,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { useSummaryClient } from '~/hooks';
import { getLocale } from '~/locales';
import { ScreenProps } from '~/screens';

export function SummaryScreen({
  route,
  navigation,
}: ScreenProps<'summary'>) {

  const { getSummary, handleInteraction } = useSummaryClient();
  const { preferredReadingFormat, setPreference } = React.useContext(SessionContext);

  const [loading, setLoading] = React.useState(false);
  const [summaryId, setSummaryId] = React.useState(0);
  const [summary, setSummary] = React.useState<PublicSummaryAttributes>();
  const [format, setFormat] = React.useState(route?.params?.initialFormat ?? ReadingFormat.Summary);
  const keywords = React.useMemo(() => route?.params?.keywords ?? [], [route]);

  const load = React.useCallback(async (id?: number) => {
    if (!id) {
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await getSummary(id, getLocale());
      if (error) {
        throw error;
      }
      if (data && data.rows && data.rows.length) {
        setSummary(data.rows[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getSummary, setPreference]);

  React.useEffect(() => {
    navigation?.setOptions({ headerTitle: '' });
  }, [navigation, summary]);

  React.useEffect(() => {
    if (summary) {
      return;
    }
    const summaryIdentifier = route?.params?.summary;
    if (typeof summaryIdentifier === 'number' || typeof summaryIdentifier === 'string') {
      setSummaryId(summaryIdentifier);
      load(summaryIdentifier);
    } else {
      setSummaryId(summaryIdentifier?.id ?? 0);
      setSummary(summaryIdentifier);
    }
  }, [load, summary, route?.params?.summary]);
  
  const siblings = React.useMemo(() => {
    return [...(summary?.siblings ?? [])].sort((a, b) => new Date(b.originalDate).valueOf() - new Date(a.originalDate).valueOf());
  }, [summary?.siblings]);
  
  const handleFormatChange = React.useCallback(
    (newSummary: PublicSummaryGroup, newFormat?: ReadingFormat) => {
      if (summary.id === newSummary.id) {
        setFormat(newFormat);
        return;
      }
      handleInteraction(newSummary, InteractionType.Read, undefined, { format: newFormat });
      navigation?.push('summary', {
        initialFormat: newFormat ?? preferredReadingFormat ?? ReadingFormat.Summary,
        summary: newSummary.id,
      });
    },
    [summary, handleInteraction, navigation, preferredReadingFormat]
  );

  return (
    <Screen>
      {loading ? (
        <View itemsCenter justifyCenter>
          <ActivityIndicator size="large" />
        </View>
      ) : (summary && (
        <FlatList
          data={ siblings }
          renderItem={ ({ item }) => (
            <Summary
              mx={ 12 }
              summary={ item } 
              hideFooter
              onFormatChange={ (format) => handleFormatChange(item, format) } />
          ) }
          keyExtractor={ (item) => `${item.id}` }
          ItemSeparatorComponent={ () => <Divider mx={ 12 } my={ 6 } /> }
          ListHeaderComponent={ (
            <React.Fragment>
              <Summary
                refreshing={ loading }
                onRefresh={ () => load(summaryId) }
                summary={ summary }
                initialFormat={ format }
                keywords={ keywords }
                onFormatChange={ (format) => handleFormatChange(summary, format) } />
              <Divider my={ 6 } />
            </React.Fragment>
          ) }
          estimatedItemSize={ 114 } />
      ))}
    </Screen>
  );
}
