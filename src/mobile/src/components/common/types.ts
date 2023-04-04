import { ViewStyle } from 'react-native';

export type Stylable<Style extends ViewStyle = ViewStyle> = {
  // dimensions
  width?: number | string;
  height?: number | string;
  // flexbox
  col?: boolean;
  row?: boolean;
  alignCenter?: boolean;
  alignStart?: boolean;
  alignEnd?: boolean;
  justifyCenter?: boolean;
  justifyStart?: boolean;
  justifyEnd?: boolean;
  justifySpaced?: boolean;
  // text styling
  color?: string;
  center?: boolean;
  left?: boolean;
  right?: boolean;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  // margins
  m?: number;
  mh?: number;
  mv?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  // padding
  p?: number;
  ph?: number;
  pv?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  // appearance
  bg?: string;
  outlined?: boolean | string | number | [string, number];
  selectable?: boolean;
  contained?: boolean;
  rounded?: boolean;
  // other
  style?: Style;
};