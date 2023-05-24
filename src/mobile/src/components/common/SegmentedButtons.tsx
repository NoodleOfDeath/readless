import React from 'react';

import {
  Button,
  View,
  ViewProps,
} from '~/components';
import { useStyles } from '~/hooks';

export type SegmentedButtonProps<T> = {
  icon?: string;
  label?: string;
  value: T;
};

export type SegmentedButtonsProps<T> = ViewProps & {
  buttons: SegmentedButtonProps<T>[];
  onValueChange?: (value: T) => void;
  value?: T;
  elevated?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SegmentedButtons = <T = any>({
  buttons,
  onValueChange,
  elevated = true,
  ...props
}: SegmentedButtonsProps<T>) => {
  const style = useStyles(props);
  const computedStyles = React.useMemo(() => elevated ? {} : { backgroundColor: '#000' }, [elevated]);
  return (
    <View 
      { ...props }
      flexGrow
      style={ [style, computedStyles] }>
      <View 
        row
        elevated={ elevated }
        gap={ 12 }>
        {buttons.map(({
          icon, label, value,
        }, index) => (
          <View row key={ `${value}${index}` }>
            <Button 
              row
              alignCenter
              justifyCenter
              gap={ 6 }
              p={ 12 }
              selectable
              selected={ value === props.value }
              startIcon={ icon as string }
              onPress={ () => onValueChange?.(value) }>
              { label}
            </Button>
          </View>
        ))}
      </View>
    </View>
  );
};