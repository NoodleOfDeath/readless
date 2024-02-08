import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
  InteractionType,
  PublicSummaryGroup,
  ReadingFormat,
} from '~/api';
import {
  ActivityIndicator,
  Screen,
  ScrollView,
  Summary,
  SummaryList,
  Text,
  View,
} from '~/components';
import {  StorageContext, ToastContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens';

export function SummaryScreen({ route }: ScreenComponent<'summary'>) {

  const { navigate, navigation } = useNavigation();

  const {
    preferredReadingFormat, 
    api: {
      interactWithSummary, 
      getSummary,
      getSummaries, 
    },
  } = React.useContext(StorageContext);
  const { showToast } = React.useContext(ToastContext);

  const [loading, setLoading] = React.useState(false);
  const [summaryId, setSummaryId] = React.useState(0);
  const [summary, setSummary] = React.useState<PublicSummaryGroup>();
  const [format, setFormat] = React.useState<ReadingFormat | undefined>(route?.params?.initialFormat ?? ReadingFormat.Bullets);
  const keywords = React.useMemo(() => route?.params?.keywords ?? [], [route]);

  const siblings = React.useMemo(() => (summary?.siblings ?? [])?.map((s) => typeof s === 'number' ? s : (s as PublicSummaryGroup).id), [summary]);
  
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
      showToast(e);
    } finally {
      setLoading(false);
    }
  }, [getSummary, showToast]);

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
  
  const handleFormatChange = React.useCallback(
    (newSummary: PublicSummaryGroup, newFormat?: ReadingFormat) => {
      if (summary?.id === newSummary.id) {
        setFormat(newFormat);
        return;
      }
      interactWithSummary(newSummary.id, InteractionType.Read, { metadata: { format: newFormat } });
      navigate('summary', {
        initialFormat: newFormat ?? preferredReadingFormat ?? ReadingFormat.Bullets,
        summary: newSummary.id,
      });
    },
    [summary, interactWithSummary, navigate, preferredReadingFormat]
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

  const summaryCard = React.useMemo(() => {
    return summary && ( 
      <Summary
        refreshing={ loading }
        onRefresh={ () => load(summaryId) }
        summary={ summary }
        initialFormat={ format }
        keywords={ keywords }
        onFormatChange={ (format) => handleFormatChange(summary, format) } />
    );
  }, [format, handleFormatChange, keywords, loading, load, summary, summaryId]);

  if (loading) {
    return (
      <Screen flex={ 1 }>
        <View flexGrow={ 1 } itemsCenter justifyCenter>
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    );
  }

  if (siblings.length === 0) {
    return (
      <Screen flex={ 1 }>
        <ScrollView flexGrow={ 1 }>
          {summaryCard}
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen flex={ 1 }>
      <SummaryList
        fetch={ getSummaries }
        specificIds={ siblings }
        headerComponent={ (
          <View flex={ 1 } gap={ 6 }>
            {summaryCard}
            {siblings.length > 0 && (
              <Text p={ 12 } system h6 m={ 12 }>
                {`${strings.relatedNews} (${ siblings.length })`}
              </Text>
            )}
          </View>
        ) } />
    </Screen>
  );
}
