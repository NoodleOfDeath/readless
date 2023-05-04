import React from 'react';

import {
  Circle,
  Path,
  Svg,
} from 'react-native-svg';

import { useTheme } from '~/hooks';

export type MeterDialProps = {
  min?: number;
  max?: number;
  value?: number;
  majorTick?: number;
  minorTick?: number;
  wedgeColors?: string[];
  meterStyle?: {
    stroke?: string;
    fill?: string;
  }
  needleStyle?: {
    stroke?: string;
    fill?: string;
  }
  width?: number;
  height?: number;
};

export function MeterDial({
  min = -1,
  max = 1,
  value = 0,
  majorTick = 0.2,
  minorTick = majorTick / 2,
  wedgeColors = [
    '#ff0000',
    '#ffcc00',
    '#cccccc',
    '#aaeeaa',
    '#00cc00',
  ],
  meterStyle,
  needleStyle,
  width = 200,
  height = width / 2,
}: MeterDialProps = {}) {
  const theme = useTheme();
  const rotation = React.useMemo(() => {
    // x / -90 = v / min -> x = -90v / min
    // x /  90 = v / max -> x =  90v / max
    // x * x = (-90v / min) * (90v / max)
    // |x| = sqrt((-90v / min) * (90v / max))
    // x = (v / |v|) * sqrt((-90v / min) * (90v / max))
    return value === 0 ? 0 : (value/Math.abs(value)) * Math.sqrt((-90 * value / min) * (90 * value / max));
  }, [min, max, value]);
  const majorTicks = React.useMemo(() => [...Array((max - min) / majorTick).keys()], [min, max, majorTick]);
  const minorTicks = React.useMemo(() => [...Array((max - min) / minorTick).keys()], [min, max, minorTick]);
  return (
    <Svg viewBox="0 0 100 60" width={ width } height={ height }>
      {wedgeColors.map((color, i) => {
        const wedgeWidth = (128 / wedgeColors.length) / 2;
        const rotation = 360 - (180 * ((wedgeColors.length - i) / wedgeColors.length));
        return (
          <Circle 
            key={ [color, i].join() }
            cx="50"
            cy="50"
            r="20"
            fill="transparent"
            stroke={ color }
            strokeWidth="40"
            strokeDasharray={ `${wedgeWidth} 360` }
            transform={ `rotate(${rotation}, 50, 50)` } />
        );
      })}
      <Path 
        d="M90,50 a10,10 0 0,0 -80,0 Z"
        stroke={ theme.colors.text }
        fill="transparent"
        { ...meterStyle } />
      {majorTicks.map((k) => {
        return (
          <Path 
            key={ k }
            d="M50,10 L50,20"
            stroke={ theme.colors.text }
            { ...meterStyle }
            transform={ `rotate(${(180 * k / majorTicks.length) - 90}, 50, 50)` } />
        );
      })}
      {minorTicks.map((k) => {
        return (
          <Path 
            key={ k }
            d="M50,10 L50,13"
            stroke={ theme.colors.text }
            { ...meterStyle }
            transform={ `rotate(${(180 * k / minorTicks.length) - 90}, 50, 50)` } />
        );
      })}
      <Path 
        d="M50,50 L46,47 L50,0 L54,47 Z" 
        stroke={ theme.colors.text }
        fill={ theme.colors.invertText }
        { ...needleStyle }
        transform={ `rotate(${rotation}, 50, 50)` } />
      <Circle
        cx="50"
        cy="50"
        r="6"
        stroke={ theme.colors.text }
        fill={ theme.colors.invertText }
        { ...needleStyle } />
    </Svg>
  );
}