import React from 'react';

import {
  Button,
  ChildlessViewProps,
  View,
} from '~/components';
import { useStyles } from '~/hooks';

export type SegmentedButtonProps<T> = {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  style?: ChildlessViewProps['style'];
  value: T;
};

export type SegmentedButtonsProps<T> = ChildlessViewProps & {
  buttons: SegmentedButtonProps<T>[];
  buttonStyle?: ChildlessViewProps['style'];
  onValueChange?: (value: T) => void;
  value?: T;
  elevated?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SegmentedButtons = <T = any>({
  buttons,
  buttonStyle,
  onValueChange,
  elevated = true,
  ...props
}: SegmentedButtonsProps<T>) => {
  const style = useStyles(props);
  const computedStyles = React.useMemo(() => elevated ? {} : { backgroundColor: '#000' }, [elevated]);
  return (
    <View
      { ...props }
      style={ [style, computedStyles] }>
      <View 
        flexRow
        elevated={ elevated }
        gap={ 12 }>
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
            startIcon={ icon }
            onPress={ () => onValueChange?.(value) }>
            { label }
          </Button>
        ))}
      </View>
    </View>
  );
};