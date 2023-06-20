import React from 'react';
import { SafeAreaView } from 'react-native';

import RNActionSheet, { ActionSheetProps as RNActionSheetProps } from 'react-native-actions-sheet';

import { ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type ActionSheetProps = ViewProps & RNActionSheetProps;

export function ActionSheet({ 
  children, 
  gestureEnabled = true, 
  ...props
}: ActionSheetProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <RNActionSheet
      { ...props }
      gestureEnabled={ gestureEnabled }
      headerAlwaysVisible={ gestureEnabled }
      elevation={ 2 }
      containerStyle={ { backgroundColor: theme.navContainerTheme.colors.background, ...style } }>
      <SafeAreaView>
        {children}
      </SafeAreaView>
    </RNActionSheet>
  );
}