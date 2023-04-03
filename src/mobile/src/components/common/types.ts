import { ViewStyle } from 'react-native';

export type Directionable = {
  col?: boolean;
  row?: boolean;
};

export type Stylable = 
  Directionable & {
  center?: boolean;
  left?: boolean;
  right?: boolean;
  m?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  p?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  outlined?: boolean;
  contained?: boolean;
  width?: number | string;
  style?: ViewStyle;
};