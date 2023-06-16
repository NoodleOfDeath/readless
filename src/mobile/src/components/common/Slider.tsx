import React from 'react';

import { Slider as RNSlider, SliderProps as RNSliderProps } from '@miblanchard/react-native-slider';

import { ChildlessViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type SliderProps = ChildlessViewProps & RNSliderProps;

export function Slider(props: SliderProps) {
  const style = useStyles(props);
  return (
    <RNSlider
      { ...props }
      containerStyle={ style } />
  );
}