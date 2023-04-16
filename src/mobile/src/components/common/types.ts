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
  // typographies
  caption?: boolean;
  subtitle1?: boolean;
  subtitle2?: boolean;
  body1?: boolean;
  body2?: boolean;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  // text styling
  color?: string;
  center?: boolean;
  left?: boolean;
  right?: boolean;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  inactive?: boolean;
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
  opacity?: number;
  selectable?: boolean;
  contained?: boolean;
  rounded?: boolean;
  // other
  style?: Style;
};