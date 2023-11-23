import React from 'react';

import {
  Button,
  Icon,
  ViewProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type CheckboxProps = ViewProps & {
  checked?: boolean;
  onPress?: () => void;
};

export function Checkbox({
  checked,
  onPress,
  ...other
}: CheckboxProps) {
  const theme = useTheme();
  const style = useStyles(other);
  return (
    <Button 
      beveled
      outlined
      alignCenter
      justifyCenter
      width={ 24 }
      height={ 24 }
      mx={ 8 }
      style={ style }
      onPress={ onPress }
      { ...other }
      leftIcon={ checked && (
        <Icon name='check' color={ theme.colors.primary } />
      ) } />
  );
}
