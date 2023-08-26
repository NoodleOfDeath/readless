import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import ContextMenu from 'react-native-context-menu-view';
import InAppReview from 'react-native-in-app-review';

function Test() {
  const titles = ['one', 'two', 'three'];
  return (
    <View style={ { rowGap: 10 } }>
      {titles.map((title) => (
        <ContextMenu
          key={ title }
          actions={ [{ title: 'share' }] }>
          <Text style={ {
            backgroundColor: '#eee',
            padding: 10,
          } }>
            {title}
          </Text>
        </ContextMenu>
      ))}
    </View>
  );
}

export function TestScreen() {

  useFocusEffect(React.useCallback(() => {
    InAppReview.RequestInAppReview();
    alert(__DEV__);
  }, []));

  return (
    <SafeAreaView style={ { flex: 1 } }>
      <View style={ { padding: 24 } }>
        <Test />
      </View>
    </SafeAreaView>
  );
}
