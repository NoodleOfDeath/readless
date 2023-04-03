import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ReadingFormat } from '~/api';
import {
  FlexView,
  SafeScrollView,
  Summary,
} from '~/components';
import { AppStateContext } from '~/contexts';
import { RootParamList } from '~/screens';

type Props = {
  route: RouteProp<RootParamList['discover'], 'summary'>;
  navigation: NativeStackNavigationProp<RootParamList['discover'], 'summary'>;
};

export function SummaryScreen({
  route: { params: { summary, format: initialFormat } },
  navigation,
}: Props) {
  const { setScreenOptions } = React.useContext(AppStateContext);

  const [format, setFormat] = React.useState<ReadingFormat | undefined>(initialFormat);

  React.useEffect(() => {
    navigation.setOptions({ headerTitle: summary?.title });
    setScreenOptions((prev) => ({
      ...prev,
      headerShown: false,
    }));
  }, [navigation, setScreenOptions, summary]);

  return (
    <SafeScrollView>
      <FlexView mt={ 10 }>
        {summary && (
          <Summary
            summary={ summary }
            format={ format }
            onChange={ (format) => setFormat(format) } />
        )}
      </FlexView>
    </SafeScrollView>
  );
}
