import React from 'react';
import { SafeAreaView } from 'react-native';

import RNActionSheet, { ActionSheetProps as RNActionSheetProps } from 'react-native-actions-sheet';

import { ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type ActionSheetProps = ViewProps & RNActionSheetProps;

export function ActionSheet({ children, ...props }: ActionSheetProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <RNActionSheet
      { ...props }
      gestureEnabled
      headerAlwaysVisible
      elevation={ 2 }
      containerStyle={ { ...theme.components.card, ...style } }>
      <SafeAreaView>
        {children}
      </SafeAreaView>
    </RNActionSheet>
  );
}