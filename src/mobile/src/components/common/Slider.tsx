import React from 'react';

import { Slider as RNSlider, SliderProps as RNSliderProps } from '@miblanchard/react-native-slider';

import { ViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type SliderProps = Omit<ViewProps, 'children'> & RNSliderProps;

export function Slider(props: SliderProps) {
  const style = useStyles(props);
  return (
    <RNSlider
      { ...props }
      containerStyle={ style } />
  );
}