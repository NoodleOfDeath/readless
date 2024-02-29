import React from 'react';
import { SafeAreaView } from 'react-native';

import RNActionSheet, {
  ActionSheetProps as RNActionSheetProps,
  SheetManager,
} from 'react-native-actions-sheet';

import {
  Button,
  View,
  ViewProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type ActionSheetProps = RNActionSheetProps & ViewProps & {
  closeButton?: React.ReactNode | boolean;
};

export function ActionSheet({ 
  children, 
  gestureEnabled = true, 
  closeButton,
  ...props
}: ActionSheetProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <RNActionSheet
      { ...props }
      elevation={ 2 }
      gestureEnabled={ gestureEnabled }
      headerAlwaysVisible={ gestureEnabled }
      containerStyle={ { backgroundColor: theme.navContainerTheme.colors.background, ...style } }>
      <SafeAreaView>
        {closeButton === true ? (
          <View
            absolute
            top={ -65 }
            right= { 5 }
            p={ 12 }
            zIndex={ 3 }>
            <Button
              rounded
              elevated
              p={ 12 }
              bg={ theme.colors.headerBackground }
              leftIcon="close" 
              onPress={ () => {
                props.onClose?.();
                props.id && SheetManager.hide(props.id);
              } } />
          </View>
        ) : closeButton}
        {children}
      </SafeAreaView>
    </RNActionSheet>
  );
}