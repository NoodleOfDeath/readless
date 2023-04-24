import { ViewStyle } from 'react-native';

export type Stylable<Style extends ViewStyle = ViewStyle> = {
  // dimensions
  width?: number | string;
  height?: number | string;
  // flexbox
  flex?: number;
  flexWrap?: 'wrap' | 'nowrap';
  flexGrow?: number | boolean;
  flexRow?: boolean;
  flexRowReverse?: boolean;
  flexColumn?: boolean;
  flexColumnReverse?: boolean;
  gap?: number;
  rowGap?: number;
  colGap?: number;
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
  fontFamily?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  inactive?: boolean;
  shadowed?: boolean;
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
  border?: number;
  borderColor?: string;
  bg?: string;
  outlined?: boolean | string | number | [string, number];
  opacity?: number;
  selectable?: boolean;
  contained?: boolean;
  rounded?: boolean;
  // other
  style?: Style;
};