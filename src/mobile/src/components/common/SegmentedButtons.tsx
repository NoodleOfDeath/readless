import React from 'react';

import { 
  Button, 
  ButtonProps,
  ChildlessViewProps,
  View,
} from '~/components';

export type SegmentedButtonProps<T extends string | number = string> = {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  style?: ChildlessViewProps['style'];
  value: T;
};

export type SegmentedButtonsProps<T extends string | number = string> = ChildlessViewProps & {
  options: SegmentedButtonProps<T>[];
  initialValue?: T;
  onValueChange?: (value: T) => void;
  buttonProps?: Partial<ButtonProps> | ((index: number, selected: boolean) => Partial<ButtonProps>);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SegmentedButtons = <T extends string | number = string>({
  initialValue,
  options: buttons,
  onValueChange,
  buttonProps,
  ...props
}: SegmentedButtonsProps<T>) => {
  const [value, setValue] = React.useState<T | undefined>(initialValue);
  return (
    <View flexRow { ...props }>
      {buttons.map(({
        icon, label, value: v,
      }, index) => (
        <Button
          key={ `${v}${index}` }
          px={ 12 }
          gap={ 6 }
          leftIcon={ icon }
          selected={ value === v }
          { ...(buttonProps instanceof Function ? buttonProps(index, value === v) : buttonProps) }
          onPress={ () => {
            setValue(v);
            onValueChange?.(v);
          } }>
          { label }
        </Button>
      ))}
    </View>
  );
};