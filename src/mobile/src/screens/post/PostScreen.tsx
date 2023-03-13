import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SafeScrollView from '../../components/common/SafeScrollView';
import Post from '../../components/post/Post';
import { ConsumptionMode } from '../../components/post/ConsumptionModeSelector';
import FlexView from '../../components/common/FlexView';
import { RootStackParamList } from '../discover/types';
import { SessionContext } from '../../contexts/SessionContext';

type Props = {
  route: RouteProp<RootStackParamList, 'Post'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Post'>;
};

export default function PostScreen({
  route: {
    params: { source, initialMode },
  },
  navigation,
}: Props) {
  const { setTabControllerScreenOptions } = React.useContext(SessionContext);

  const [mode, setMode] = React.useState<ConsumptionMode | undefined>(
    initialMode
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: source?.title,
    });
    setTabControllerScreenOptions((prev) => ({
      ...prev,
      headerShown: false,
    }));
  }, [source]);

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
