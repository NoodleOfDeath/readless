import React from 'react';

import {
  Screen,
  TabSwitcher,
  View,
} from '~/components';
import { ScreenProps } from '~/screens';

export function MyStuffScreen({ navigation }: ScreenProps<'default'>) {
  
  const [activeTab, setActiveTab] = React.useState(0);
  
  return (
    <Screen>
      <View col mh={ 16 }>
        <TabSwitcher
          activeTab={ activeTab }
          onTabChange={ setActiveTab }
          titles={ ['All News', 'Your News'] }>
          
        </TabSwitcher>
      </View>
    </Screen>
  );
}
