import React from 'react';
import { SafeAreaView, View } from 'react-native';

import ContextMenu from 'react-native-context-menu-view';

import {
  DataSection,
  DraggableList,
  Text,
} from '~/components';

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

const sections: DataSection[] = Array.from(Array(5).keys()).map((k) => ({
  data: Array.from(Array(3).keys()).map((n) => ({
    key: n,
    label: n,
  })),
  key: k,
  title: `${k}`,
}));

export function TestScreen() {
  
  return (
    <SafeAreaView style={ { flex: 1 } }>
      <View style={ { padding: 24 } }>
        <Test />
        <DraggableList
          sections={ sections }
          renderItem={ ({ item }) => (
            <Text>{item.label}</Text>) } />
      </View>
    </SafeAreaView>
  );
}
