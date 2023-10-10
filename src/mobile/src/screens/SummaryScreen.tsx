import React from 'react';
import { RefreshControl } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  InteractionType,
  PublicSummaryGroup,
  ReadingFormat,
} from '~/api';
import {
  ActivityIndicator,
  FlatList,
  Summary,
  Text,
  View,
} from '~/components';
import {  SessionContext } from '~/contexts';
import { useApiClient } from '~/hooks';
import { strings } from '~/locales';
import { RoutedScreen } from '~/navigation';
import { ScreenComponent } from '~/screens';

export function SummaryScreen({
  route,
  navigation,
}: ScreenComponent<'summary'>) {

  const { getSummary, interactWithSummary } = useApiClient();
  const { preferredReadingFormat } = React.useContext(SessionContext);

  const [loading, setLoading] = React.useState(false);
  const [summaryId, setSummaryId] = React.useState(0);
  const [summary, setSummary] = React.useState<PublicSummaryGroup>();
  const [format, setFormat] = React.useState<ReadingFormat | undefined>(route?.params?.initialFormat ?? ReadingFormat.Bullets);
  const keywords = React.useMemo(() => route?.params?.keywords ?? [], [route]);
  
  const load = React.useCallback(async (id?: number) => {
    if (!id) {
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await getSummary(id);
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
  }, [getSummary]);

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
    return [...(summary?.siblings ?? [])].sort((a, b) => new Date(b.originalDate ?? '').valueOf() - new Date(a.originalDate ?? '').valueOf());
  }, [summary?.siblings]);
  
  const handleFormatChange = React.useCallback(
    (newSummary: PublicSummaryGroup, newFormat?: ReadingFormat) => {
      if (summary?.id === newSummary.id) {
        setFormat(newFormat);
        return;
      }
      interactWithSummary(newSummary.id, InteractionType.Read, { metadata: { format: newFormat } });
      navigation?.push('summary', {
        initialFormat: newFormat ?? preferredReadingFormat ?? ReadingFormat.Bullets,
        summary: newSummary.id,
      });
    },
    [summary, interactWithSummary, navigation, preferredReadingFormat]
  );
  
  useFocusEffect(React.useCallback(() => {
    if (!summary) {
      return;
    }
    navigation?.setOptions({
      headerRight: () => (
        <View>
          <Summary 
            footerOnly 
            summary={ summary } 
            initialFormat={ format } />
        </View>
      ),
      headerTitle: '', 
    });
  }, [summary, format, navigation]));

  return (
    <RoutedScreen navigationID='newsStackNav'>
      {loading ? (
        <View flexGrow={ 1 } itemsCenter justifyCenter>
          <ActivityIndicator size="large" />
        </View>
      ) : (summary && (
        <FlatList
          refreshControl={ (
            <RefreshControl 
              refreshing={ loading }
              onRefresh={ () => load(summaryId) } />
          ) }
          data={ siblings }
          renderItem={ ({ item }) => (
            <Summary
              mx={ 12 }
              key={ item.id }
              summary={ item } 
              hideArticleCount
              onFormatChange={ (format) => handleFormatChange(item, format) } />
          ) }
          ItemSeparatorComponent={ () => <View mx={ 12 } my={ 6 } /> }
          ListHeaderComponent={ (
            <React.Fragment>
              <Summary
                refreshing={ loading }
                onRefresh={ () => load(summaryId) }
                summary={ summary }
                initialFormat={ format }
                keywords={ keywords }
                onFormatChange={ (format) => handleFormatChange(summary, format) } />
              {siblings.length > 0 && (
                <Text system h6 m={ 12 }>
                  {`${strings.summary_relatedNews} (${siblings.length})`}
                </Text>
              )}
            </React.Fragment>
          ) }
          ListFooterComponentStyle={ { paddingBottom: 64 } }
          estimatedItemSize={ 114 } />
      ))}
    </RoutedScreen>
  );
}
