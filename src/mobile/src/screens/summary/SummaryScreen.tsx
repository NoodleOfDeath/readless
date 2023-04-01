import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ReadingFormat } from '../../api';
import FlexView from '../../components/common/FlexView';
import SafeScrollView from '../../components/common/SafeScrollView';
import Summary from '../../components/post/Summary';
import { SessionContext } from '../../contexts/SessionContext';
import { RootParamList } from '../../types';

type Props = {
  route: RouteProp<RootParamList['Discover'], 'Summary'>;
  navigation: NativeStackNavigationProp<RootParamList['Discover'], 'Summary'>;
};

export default function SummaryScreen({
  route: { params: { summary, format: initialFormat } },
  navigation,
}: Props) {
  const { setTabControllerScreenOptions } = React.useContext(SessionContext);

  const [format, setFormat] = React.useState<ReadingFormat | undefined>(initialFormat);

  React.useEffect(() => {
    navigation.setOptions({ headerTitle: summary?.title });
    setTabControllerScreenOptions((prev) => ({
      ...prev,
      headerShown: false,
    }));
  }, [navigation, setTabControllerScreenOptions, summary]);

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
