import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import ContextMenu from 'react-native-context-menu-view';

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
  return (
    <SafeAreaView style={ { flex: 1 } }>
      <View style={ { padding: 24 } }>
        <Test />
      </View>
    </SafeAreaView>
  );
}
