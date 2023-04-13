import React from 'react';

import {
  Button,
  Icon,
  ViewProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type CheckboxProps = RNPCheckboxProps & {
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
      rounded
      outlined
      width={ 24 }
      height={ 24 }
      mh={ 8 }
      style={ style }
      onPress={ onPress }
      { ...other }>
      {checked && (
        <Icon name='check' color={ theme.colors.primary } />
      )}
    </Button>
  );
}

