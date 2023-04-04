import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  InteractionResponse,
  InteractionType,
  ReadingFormat,
} from '~/api';
import {
  FlexView,
  SafeScrollView,
  Summary,
} from '~/components';
import { AppStateContext } from '~/contexts';
import { useSummaryClient } from '~/hooks';
import { RootParamList } from '~/screens';

type Props = {
  route: RouteProp<RootParamList['discover' | 'search'], 'summary'>;
  navigation: NativeStackNavigationProp<RootParamList['discover' | 'search'], 'summary'>;
};

export function SummaryScreen({
  route: { params: { summary, format: initialFormat } },
  navigation,
}: Props) {
  const { setScreenOptions } = React.useContext(AppStateContext);
  const { interactWithSummary, recordSummaryView } = useSummaryClient();

  const [format, setFormat] = React.useState<ReadingFormat | undefined>(initialFormat);
  const [interactions, setInteractions] = React.useState<InteractionResponse | undefined>(summary?.interactions);

  React.useEffect(() => {
    navigation.setOptions({ headerTitle: summary?.title });
    setScreenOptions((prev) => ({
      ...prev,
      headerShown: false,
    }));
  }, [navigation, setScreenOptions, summary]);
  
  const handleFormatChange = React.useCallback(async (format?: ReadingFormat) => {
    if (!summary || !format || format === initialFormat) {
      return;
    }
    await recordSummaryView(summary, undefined, { format });
    setFormat(format);
  }, [initialFormat, recordSummaryView, summary]);
  
  const onInteract = React.useCallback(async (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>) => {
    if (!summary) {
      return;
    }
    const { data, error } = await interactWithSummary(summary, interaction, content, metadata);
    if (error) {
      console.log(error);
      return;
    }
    if (!data) {
      return;
    }
    setInteractions(data);
  }, [interactWithSummary, summary]);

  return (
    <SafeScrollView>
      <FlexView mt={ 10 }>
        {summary && (
          <Summary
            summary={ summary }
            format={ format }
            onChange={ (format) => handleFormatChange(format) }
            onInteract={ onInteract }
            realtimeInteractions={ interactions } />
        )}
      </FlexView>
    </SafeScrollView>
  );
}
