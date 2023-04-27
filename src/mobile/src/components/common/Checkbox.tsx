import React from 'react';

import {
  Button,
  Icon,
  ViewProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type CheckboxProps = {
  checked?: boolean;
  onPress?: () => void;
} & ViewProps;

export function Checkbox({
  checked,
  onPress,
  ...other
}: CheckboxProps) {
  const theme = useTheme();
  const style = useStyles(other);
  return (
    <Button 
      rounded
      outlined
      alignCenter
      justifyCenter
      width={ 24 }
      height={ 24 }
      mh={ 8 }
      style={ style }
      onPress={ onPress }
      { ...other }
      startIcon={ checked && (
        <Icon name='check' color={ theme.colors.primary } />
      ) } />
  );
}

