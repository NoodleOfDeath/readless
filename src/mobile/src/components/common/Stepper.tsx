import React from 'react';

import {
  Button,
  ChildlessViewProps,
  TextInput,
  View,
} from '~/components';

export type StepperProps = ChildlessViewProps & {
  value?: number;
  offset?: number;
  minimumValue?: number;
  maximumValue?: number;
  stepValue?: number;
  onValueChange?: (value?: number) => void;
};

export function Stepper({
  value = 0,
  offset = 0,
  minimumValue = 0,
  maximumValue = 100,
  stepValue = 1,
  onValueChange,
  ...props
}: StepperProps) {
  return (
    <View
      flexRow
      gap={ 6 }
      itemsCenter
      { ...props }>
      <TextInput
        flat
        value={ `${(value + offset).toFixed(2)}` }
        inputMode='numeric'
        keyboardType="numeric"
        onChangeText={ (text) => {
          const value = Number(text);
          if (!Number.isNaN(value)) {
            onValueChange?.(value - offset);
          } else {
            onValueChange?.(undefined);
          }
        } } />
      <View flexRow gap={ 6 } itemsCenter>
        <Button
          leftIcon="minus"
          elevated
          haptic
          p={ 8 }
          disabled={ value <= minimumValue }
          onPress={ () => onValueChange?.(value - stepValue) } />
        <Button
          leftIcon="plus"
          elevated
          haptic
          p={ 8 }
          disabled={ value >= maximumValue }
          onPress={ () => onValueChange?.(value + stepValue) } />
      </View>
    </View>
  );
}