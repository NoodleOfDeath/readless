import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { 
  BackNavigation,
  Screen,
  ScrollView,
  Text,
  View,
} from '~/components';
import { ScreenProps } from '~/screens';

export function RecapScreen({
  route,
  navigation,
}: ScreenProps<'recap'>) {
  
  const recap = React.useMemo(() => route?.params?.recap, [route]);
  
  useFocusEffect(React.useCallback(() => {
    navigation?.setOptions({
      header: () => (
        <View 
          row 
          itemsCenter
          elevated
          zIndex={ 100 }
          height={ 80 } 
          p={ 12 }>
          <View row gap={ 12 } itemsCenter>
            <BackNavigation />
            <View>
              <Text 
                row
                h6 
                bold>
                {recap?.title}
              </Text>
              <Text subtitle2>{recap?.createdAt}</Text>
            </View>
          </View>
        </View>
      ),
    });
  }, [navigation, recap?.createdAt, recap?.title]));
  
  return (
    <Screen>
      <View p={ 12 }>
        <ScrollView>
          <Text h4>
            {recap?.text}
          </Text>
        </ScrollView>
      </View>
    </Screen>
  );
}