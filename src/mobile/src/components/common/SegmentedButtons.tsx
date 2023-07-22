import React from 'react';

import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

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
  pressOnly?: boolean;
};

export type SegmentedButtonsProps<T extends string | number = string> = ChildlessViewProps & {
  options: SegmentedButtonProps<T>[];
  initialValue?: T;
  onValueChange?: (value: T) => void;
  buttonProps?: Partial<ButtonProps> | ((option: SegmentedButtonProps<T>, selected: boolean) => Partial<ButtonProps>);
  buttonMenuItems?: (option: SegmentedButtonProps<T>, selected: boolean) => MenuItemProps[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SegmentedButtons = <T extends string | number = string>({
  initialValue,
  options,
  onValueChange,
  buttonProps,
  buttonMenuItems,
  ...props
}: SegmentedButtonsProps<T>) => {
  const [value, setValue] = React.useState<T | undefined>(initialValue);
  React.useEffect(() => {
    setValue(initialValue);
    if (initialValue) {
      onValueChange?.(initialValue);
    }
  }, [initialValue, onValueChange]);
  return (
    <View flexRow { ...props }>
      {options.map((option, index) => (
        <HoldItem 
          key={ `${option.value}${index}` }
          items={ buttonMenuItems?.(option, value === option.value) ?? [] }>
          <Button
            px={ 12 }
            gap={ 6 }
            adjustsFontSizeToFit
            leftIcon={ option.icon }
            selected={ value === option.value }
            { ...(buttonProps instanceof Function ? buttonProps(option, value === option.value) : buttonProps) }
            onPress={ () => {
              if (!option.pressOnly) { 
                setValue(option.value);
              }
              onValueChange?.(option.value);
            } }>
            { option.label }
          </Button>
        </HoldItem>
      ))}
    </View>
  );
};