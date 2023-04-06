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
import { AppStateContext } from '~/contexts';
import { useSummaryClient } from '~/hooks';
import { RootParamList } from '~/screens';

type Props = {
  route: RouteProp<RootParamList['discover' | 'search'], 'summary'>;
  navigation: NativeStackNavigationProp<RootParamList['discover' | 'search'], 'summary'>;
};

export function SummaryScreen({
  route: { params: { summary, initialFormat } },
  navigation,
}: Props) {
  const {
    setScreenOptions, setShowLoginDialog, setLoginDialogProps, 
  } = React.useContext(AppStateContext);
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
  
  const onInteract = React.useCallback(async (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>) => {
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
  }, [interactWithSummary, setLoginDialogProps, setShowLoginDialog, summary]);

  return (
    <SafeScrollView>
      <View mt={ 10 }>
        {summary && (
          <Summary
            summary={ summary }
            format={ format }
            onChange={ (format) => handleFormatChange(format) }
            onInteract={ onInteract }
            realtimeInteractions={ interactions } />
        )}
      </View>
    </SafeScrollView>
  );
}
