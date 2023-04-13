import React from 'react';
import { Pressable, SafeAreaView } from 'react-native';

import {
  Portal,
  Provider,
  Dialog as RNDialog,
} from 'react-native-paper';

import { View, ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type DialogProps = ViewProps & React.PropsWithChildren<{
  visible?: boolean;
  onClose?: () => void;
  title?: string;
  actions?: React.ReactNode | React.ReactNode[];
}>;

export function Dialog({
  children,
  visible,
  onClose,
  title,
  actions,
  ...other
}: DialogProps) {
  const theme = useTheme();
  const style = useStyles(other);
  
  const dialogActions = React.useMemo(() => actions && (Array.isArray(actions) ? actions : [actions]).map((a, i) => ({ ...a, key: i })), [actions]);
  
  return (
    <RNDialog 
      visible={ visible }
      onDismiss={ () => onClose?.() }
      style={ theme.components.dialog }>
      {title && (
        <RNDialog.Title style={ { color: theme.colors.text } }>{title}</RNDialog.Title>
      )}
      <RNDialog.Content>
        <View>
          {children}
        </View>
      </RNDialog.Content>
      {dialogActions && dialogActions.length > 0 && (
        <RNDialog.Actions>
          {actions}
        </RNDialog.Actions>
      )}
    </RNDialog>
  );
}