import React from 'react';
import { Pressable, Text } from 'react-native';

import { Divider } from 'react-native-elements';
import {
  MenuOptions,
  MenuTrigger,
  Menu as ReactNativeMenu,
  MenuProps as ReactNativeMenuProps,
} from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import { useTheme } from '../theme';

export type MenuOption = {
  icon?: React.ReactNode;
  label: string;
  onPress: () => void;
};

export type MenuProps<T extends MenuOption> = Omit<
  ReactNativeMenuProps,
  'children'
> & {
  icon?: React.ReactNode;
  iconSize?: number;
  iconColor?: string;
  options?: T[];
};

export default function Menu<T extends MenuOption>({
  icon,
  iconSize = 24,
  iconColor,
  options,
  ...props
}: MenuProps<T>) {
  const theme = useTheme();
  return (
    <ReactNativeMenu { ...props }>
      <MenuTrigger style={ theme.components.button }>
        {typeof icon === 'string' ? (
          <MaterialCommunityIcons
            name={ icon }
            size={ iconSize }
            color={ iconColor ?? theme.components.button.color } />
        ) : (
          icon
        )}
      </MenuTrigger>
      <MenuOptions
        customStyles={ { optionsContainer: theme.components.menu } }>
        {options?.map((option, i) => (
          <React.Fragment key={ option.label }>
            <Pressable onPress={ option.onPress } style={ theme.components.button }>
              {option.icon && typeof option.icon === 'string' ? (
                <MaterialCommunityIcons
                  name={ option.icon }
                  size={ iconSize }
                  color={ iconColor ?? theme.components.button.color } />
              ) : (
                option.icon
              )}
              <Text style={ theme.components.buttonBlock }>{option.label}</Text>
            </Pressable>
            {i < options.length - 1 && (
              <Divider style={ theme.components.divider } />
            )}
          </React.Fragment>
        ))}
      </MenuOptions>
    </ReactNativeMenu>
  );
}
