import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { RouteProp } from '@react-navigation/native';

import { ConsumptionMode } from '../../components/post/ConsumptionModeSelector';
import FlexView from '../../components/common/FlexView';
import Post from '../../components/post/Post';
import { RootParamList } from '../../types';
import SafeScrollView from '../../components/common/SafeScrollView';
import { SessionContext } from '../../contexts/SessionContext';

type Props = {
  route: RouteProp<RootParamList['Discover'], 'Post'>;
  navigation: NativeStackNavigationProp<RootParamList['Discover'], 'Post'>;
};

export default function PostScreen({
  route: { params: { source, initialMode } },
  navigation,
}: Props) {
  const { setTabControllerScreenOptions } = React.useContext(SessionContext);

  const [mode, setMode] = React.useState<ConsumptionMode | undefined>(
    initialMode,
  );

  React.useEffect(() => {
    navigation.setOptions({ headerTitle: source?.title });
    setTabControllerScreenOptions((prev) => ({
      ...prev,
      headerShown: false,
    }));
  }, [navigation, setTabControllerScreenOptions, source]);

  return (
    <SafeScrollView>
      <FlexView mt={10}>
        {source && (
          <Post
            source={source}
            mode={mode}
            onChange={(mode) => setMode(mode)}
          />
        )}
      </FlexView>
    </SafeScrollView>
  );
}
