import React from 'react';

import { Button as NBButton } from 'native-base';

import {
  Button,
  ChildlessViewProps,
  View,
} from '~/components';
import { useStyles } from '~/hooks';

export type SegmentedButtonProps<T extends string | number = string> = {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  style?: ChildlessViewProps['style'];
  value: T;
};

export type SegmentedButtonsProps<T extends string | number = string> = ChildlessViewProps & {
  buttons: SegmentedButtonProps<T>[];
  buttonStyle?: ChildlessViewProps['style'];
  onValueChange?: (value: T) => void;
  value?: T;
  elevated?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SegmentedButtons = <T extends string | number = string>({
  buttons,
  buttonStyle,
  onValueChange,
  ...props
}: SegmentedButtonsProps<T>) => {
  return (
    <NBButton.Group>
      {buttons.map(({
        icon, label, value, style,
      }, index) => (
        <Button 
          key={ `${value}${index}` }
          style={ [style, buttonStyle] }
          flexRow
          flexGrow={ 1 }
          alignCenter
          justifyCenter
          gap={ 6 }
          p={ 12 }
          selectable
          selected={ value === props.value }
          leftIcon={ icon }
          onPress={ () => onValueChange?.(value) }>
          { label }
        </Button>
      ))}
    </NBButton.Group>
  );
};