import React from 'react';

import { Button as NBButton } from 'native-base';

import { Button, ChildlessViewProps } from '~/components';

export type SegmentedButtonProps<T extends string | number = string> = {
  icon?: string | JSX.Element | JSX.Element[];
  label?: string | JSX.Element | JSX.Element[];
  style?: ChildlessViewProps['style'];
  value: T;
};

export type SegmentedButtonsProps<T extends string | number = string> = ChildlessViewProps & {
  buttons: SegmentedButtonProps<T>[];
  initialValue?: T;
  onValueChange?: (value: T) => void;
  elevated?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SegmentedButtons = <T extends string | number = string>({
  initialValue,
  buttons,
  onValueChange,
}: SegmentedButtonsProps<T>) => {
  const [value, setValue] = React.useState<T>(initialValue);
  return (
    <NBButton.Group isAttached mr={ 12 }>
      {buttons.map(({
        icon, label, value: v,
      }, index) => (
        <Button
          key={ `${v}${index}` }
          horizontal
          selectable
          px={ 12 }
          my={ -24 } 
          leftIcon={ icon }
          selected={ value === v }
          onPress={ () => {
            setValue(v);
            onValueChange?.(v);
          } }>
          { label }
        </Button>
      ))}
    </NBButton.Group>
  );
};