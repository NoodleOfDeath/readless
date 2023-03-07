import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

export default function Post() {

  const isLightMode = useColorScheme() === 'light';
  const styles = createStyles(isLightMode);

  return (
    <View>
      <Text style={styles.text}>Post</Text>
    </View>
  );
}

function createStyles(isLightMode: boolean) {
  return StyleSheet.create({
    text: {
      color: isLightMode ? '#000' : '#fff',
    }
  });
}