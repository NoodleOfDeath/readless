import React from 'react';

import { Switch as RNSwitch, SwitchProps as RNSwitchProps } from 'react-native-paper';

import { 
  Chip,
  Text, 
  View,
} from '~/components';
import { useTheme } from '~/hooks';

export type SwitchProps = RNSwitchProps & {
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  spacing?: number;
};

export const Switch = ({
  leftLabel,
  rightLabel,
  value,
  onValueChange,
  ...props
}: SwitchProps) => {
  const theme = useTheme();
  return (
    <View flexRow itemsCenter gap={ 12 }>
      {leftLabel && (
        <Chip contained onPress={ () => onValueChange?.(false) }>
          { typeof leftLabel === 'string' ? <Text>{ leftLabel }</Text> : leftLabel }
        </Chip>
      )}
      <RNSwitch 
        value={ value }
        onValueChange={ onValueChange }
        color={ theme.colors.primary } 
        { ...props } />
      { rightLabel && (
        <Chip contained onPress={ () => onValueChange?.(true) }>
          { typeof rightLabel === 'string' ? <Text>{ rightLabel }</Text> : rightLabel }
        </Chip>
      )}
    </View>
  );
};