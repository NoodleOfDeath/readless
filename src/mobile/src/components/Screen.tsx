import React from 'react';
import { ScrollView, StyleSheet, View, useColorScheme } from 'react-native';

type Props = React.ComponentProps<typeof ScrollView>;

export default function Screen({children, ...props}: Props) {

  const isLightMode = useColorScheme() === 'light';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      backgroundColor: isLightMode ? '#fff' : '#000',
    }
  });

  return (
    <ScrollView {...props} >
      <View style={styles.container}>
        {children}
      </View>
    </ScrollView>
  );
}