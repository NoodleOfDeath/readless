import { ViewStyle } from 'react-native';

export type Directionable = {
  col?: boolean;
  row?: boolean;
};

export type Stylable<Style extends ViewStyle = ViewStyle> = 
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
  selectable?: boolean;
  contained?: boolean;
  width?: number | string;
  rounded?: boolean;
  style?: Style;
};