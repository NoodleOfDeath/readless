import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import { HoldItem } from 'react-native-hold-menu';

function Test() {
  const titles = ['one', 'two', 'three'];
  return (
    <View style={ { rowGap: 10 } }>
      {titles.map((title) => (
        <HoldItem
          key={ title }
          items={ [{
            key: title,
            onPress: function test() {
              alert(title);
            },
            text: 'share',
          }] }>
          <Text style={ {
            backgroundColor: '#eee',
            padding: 10,
          } }>
            {title}
          </Text>
        </HoldItem>
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
