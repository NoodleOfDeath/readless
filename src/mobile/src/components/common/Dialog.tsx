import React from 'react';

import { Dialog as RNDialog } from 'react-native-paper';

import { ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type DialogProps = ViewProps & React.PropsWithChildren<{
  visible?: boolean;
  onClose?: () => void;
  title?: string;
  actions?: React.ReactNode | React.ReactNode[];
}>;

export function Dialog({
  children,
  visible = false,
  onClose,
  title,
  actions,
  ...other
}: DialogProps) {
  const theme = useTheme();
  const style = useStyles(other);
  
  const dialogActions = React.useMemo(() => actions && (Array.isArray(actions) ? actions : [actions]), [actions]);
  
  return (
    <RNDialog 
      visible={ visible }
      onDismiss={ () => onClose?.() }
      style={ style }>
      {title && (
        <RNDialog.Title style={ { color: theme.colors.text } }>{title}</RNDialog.Title>
      )}
      <RNDialog.Content>
        {children}
      </RNDialog.Content>
      {dialogActions && dialogActions.length > 0 && (
        <RNDialog.Actions>
          {actions}
        </RNDialog.Actions>
      )}
    </RNDialog>
  );
}