import React from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';

import { 
  BackNavigation,
  Divider, 
  Header,
  Highlighter,
  Screen,
  ScrollView,
  SummaryList,
  Text,
  View,
} from '~/components';
import { 
  useNavigation, 
  useSummaryClient,
  useTheme,
} from '~/hooks';
import { getFnsLocale, strings } from '~/locales';
import { ScreenProps } from '~/screens';

export function RecapScreen({
  route,
  navigation,
}: ScreenProps<'recap'>) {
  
  const theme = useTheme();
  const { openSummary } = useNavigation();
  const { getSummaries } = useSummaryClient();
  
  const recap = React.useMemo(() => route?.params?.recap, [route]);
  
  const searchWords = React.useMemo(() => {
    if (!recap) {
      return [];
    }
    const words: string[] = [];
    const matches = recap.text?.matchAll(/\[(\d+(?:\s*,\s*\d+)*)\]/g);
    if (matches) {
      for (const match of matches) {
        const [, ids] = match;
        words.push(...ids.split(/\s*,\s*/));
      }
    }
    return words;
  }, [recap]);

  const ids = React.useMemo(() => searchWords.map((word) => Number(word)), [searchWords]);
  
  useFocusEffect(React.useCallback(() => {
    navigation?.setOptions({
      header: () => (
        <Header 
          back
          title={ recap?.title }
          subtitle={ format(new Date(recap?.createdAt ?? ''), 'EEEE PP', { locale: getFnsLocale() }) } 
          elevated />
      ),
    });
  }, [navigation, recap?.createdAt, recap?.title]));
  
  return (
    <Screen>
      <ScrollView flex={ 1 }>
        <View p={ 12 }>
          <Highlighter
            searchWords={ searchWords }
            propsFor={ (text) => ({ onPress: () => openSummary({ summary: Number(text) }) }) }
            highlightStyle={ {
              color: theme.colors.link,
              fontWeight: 'bold',
            } }
            replacementFor={ (text, index) => `${index}` }>
            {recap?.text}
          </Highlighter>
        </View>
      </ScrollView>
      <Divider />
      <View p={ 12 }>
        <Text>{strings.recaps_references}</Text>
      </View>
      <SummaryList
        flex={ 1 }
        fixed
        fetch={ getSummaries }
        specificIds={ ids } />
    </Screen>
  );
}