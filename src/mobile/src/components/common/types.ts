import { ViewStyle } from 'react-native';

export const FONT_SIZES = {
  body1: 16,
  body2: 15,
  caption: 14,
  h1: 36,
  h2: 32,
  h3: 28,
  h4: 26,
  h5: 24,
  h6: 22,
  subtitle1: 18,
  subtitle2: 17,
} as const;

export type Stylable<Style extends ViewStyle = ViewStyle> = 
  { [key in keyof typeof FONT_SIZES]?: boolean } & {
  // position
  absolute?: boolean;
  relative?: boolean;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
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
  // text styling
  color?: string;
  textCenter?: boolean;
  textLeft?: boolean;
  textRight?: boolean;
  fontFamily?: string;
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