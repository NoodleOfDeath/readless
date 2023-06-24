import {
  PressableProps,
  TextProps as RNTextProps,
  ViewProps as RNViewProps,
  StyleProp,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

export const AVAILABLE_FONTS = [
  'Anek Latin',
  'Pitagon Serif',
  'Newsreader',
  'Roboto Serif',
] as const;

export const SYSTEM_FONT = 'Anek Latin';
export const DEFAULT_PREFERRED_FONT = 'Anek Latin';

export type FontFamily = (typeof AVAILABLE_FONTS[number]);

export const FONT_SIZES = {
  body1: 17,
  body2: 16,
  caption: 14,
  h1: 30,
  h2: 28,
  h3: 26,
  h4: 24,
  h5: 22,
  h6: 20,
  subscript: 10,
  subtitle1: 19,
  subtitle2: 18,
} as const;

export type TextProps = { [key in keyof typeof FONT_SIZES]?: boolean } & RNTextProps & TextStyle & {
  
  // font and size
  system?: boolean;
  /** alias for {@link TextProps.fontFamily} */
  font?: FontFamily;
  fontFamily?: FontFamily;
  fontSize?: TextStyle['fontSize'];
  /** alias for {@link TextProps.adjustFontSizeToFit} */
  adaptive?: RNTextProps['adjustsFontSizeToFit'];
  adjustsFontSizeToFit?: RNTextProps['adjustsFontSizeToFit'];
  /** set `true` to make font not scale to preference */
  fontSizeFixed?: boolean;
  
  // Spacing and height
  letterSpacing?: TextStyle['letterSpacing'];
  lineHeight?: TextStyle['lineHeight'];
  
  // alignment
  /** alias for {@link textAlign} = `"center"` **/
  textCenter?: boolean;
  /** alias for {@link textAlign} = `"left"` **/
  textLeft?: boolean;
  /** alias for {@link textAlign} = `"right"` **/
  textRight?: boolean;
  textAlign?: TextStyle['textAlign'];
  
  // style and color
  /** alias for {@link fontWeight} = `"bold"` **/
  bold?: boolean;
  /** alias for {@link fontStyle} = `"italic"` **/
  italic?: boolean;
  /** alias for {@link textDecorationLine} = `"underline"` **/
  underline?: boolean;
  color?: TextStyle['color'];

  capitalize?: boolean;
};

export type ViewProps = TouchableOpacityProps & PressableProps & RNViewProps & ViewStyle & {
  
  // preset variants
  outlined?: boolean;
  rounded?: boolean;
  
  // position
  absolute?: boolean;
  relative?: boolean;
  pos?: ViewStyle['position'];
  position?: ViewStyle['position'];
  t?: ViewStyle['top'];
  top?: ViewStyle['top'];
  b?: ViewStyle['bottom'];
  bottom?: ViewStyle['bottom'];
  l?: ViewStyle['left'];
  left?: ViewStyle['left'];
  r?: ViewStyle['right'];
  right?: ViewStyle['right'];
  z?: ViewStyle['zIndex'];
  zIndex?: ViewStyle['zIndex'];
  
  // dimensions
  aspect?: ViewStyle['aspectRatio'];
  aspectRatio?: ViewStyle['aspectRatio'];
  w?: ViewStyle['width'];
  width?: ViewStyle['width'];
  h?: ViewStyle['height'];
  height?: ViewStyle['height'];
  minW?: ViewStyle['minWidth'];
  minWidth?: ViewStyle['minWidth'];
  minH?: ViewStyle['minHeight'];
  minHeight?: ViewStyle['minHeight'];
  maxW?: ViewStyle['maxWidth'];
  maxWidth?: ViewStyle['maxWidth'];
  maxH?: ViewStyle['maxHeight'];
  maxHeight?: ViewStyle['maxHeight'];
  
  // margin
  m?: ViewStyle['margin']
  margin?: ViewStyle['margin']
  mx?: ViewStyle['marginHorizontal']
  my?: ViewStyle['marginVertical']
  ml?: ViewStyle['marginLeft']
  marginLeft?: ViewStyle['marginLeft']
  mr?: ViewStyle['marginRight']
  marginRight?: ViewStyle['marginRight']
  mt?: ViewStyle['marginTop']
  marginTop?: ViewStyle['marginTop']
  mb?: ViewStyle['marginBottom']
  marginBottom?: ViewStyle['marginBottom']
  
  // padding
  p?: ViewStyle['padding']
  padding?: ViewStyle['padding']
  px?: ViewStyle['paddingHorizontal']
  py?: ViewStyle['paddingVertical']
  pl?: ViewStyle['paddingLeft']
  paddingLeft?: ViewStyle['paddingLeft']
  pr?: ViewStyle['paddingRight']
  paddingRight?: ViewStyle['paddingRight']
  pt?: ViewStyle['paddingTop']
  paddingTop?: ViewStyle['paddingTop']
  pb?: ViewStyle['paddingBottom']
  paddingBottom?: ViewStyle['paddingBottom']
  
  // appearance
  bg?: ViewStyle['backgroundColor'];
  bgColor?: ViewStyle['backgroundColor'];
  backgroundColor?: ViewStyle['backgroundColor'];
  opacity?: ViewStyle['opacity'];
  overflow?: ViewStyle['overflow'];
  
  // border color
  bColor?: ViewStyle['borderColor'];
  borderColor?: ViewStyle['borderColor'];
  bcTop?: ViewStyle['borderTopColor'];
  borderTopColor?: ViewStyle['borderTopColor'];
  bcRight?: ViewStyle['borderRightColor'];
  borderRightColor?: ViewStyle['borderRightColor'];
  bcBottom?: ViewStyle['borderBottomColor'];
  borderBottomColor?: ViewStyle['borderBottomColor'];
  bcLeft?: ViewStyle['borderLeftColor'];
  borderLeftColor?: ViewStyle['borderLeftColor'];
  
  // border radius
  bRadius?: ViewStyle['borderRadius'];
  borderRadius?: ViewStyle['borderRadius'];
  brTopLeft?: ViewStyle['borderTopLeftRadius'];
  borderTopLeftRadius?: ViewStyle['borderTopLeftRadius'];
  brTopRight?: ViewStyle['borderTopRightRadius'];
  borderTopRightRadius?: ViewStyle['borderTopRightRadius'];
  brBottomLeft?: ViewStyle['borderBottomLeftRadius'];
  borderBottomLeftRadius?: ViewStyle['borderBottomLeftRadius'];
  brBottomRight?: ViewStyle['borderBottomRightRadius'];
  borderBottomRightRadius?: ViewStyle['borderBottomRightRadius'];
  
  // border width
  bWidth?: ViewStyle['borderWidth'];
  borderWidth?: ViewStyle['borderWidth'];
  bwTop?: ViewStyle['borderTopWidth'];
  borderTopWidth?: ViewStyle['borderTopWidth'];
  bwRight?: ViewStyle['borderRightWidth'];
  borderRightWidth?: ViewStyle['borderRightWidth'];
  bwBottom?: ViewStyle['borderBottomWidth'];
  borderBottomWidth?: ViewStyle['borderBottomWidth'];
  bwLeft?: ViewStyle['borderLeftWidth'];
  borderLeftWidth?: ViewStyle['borderLeftWidth'];
  
  // flex
  col?: boolean;
  colRev?: boolean;
  row?: boolean;
  rowRev?: boolean;
  
  flexRow?: boolean;
  flexRowRev?: boolean;
  flexRowReverse?: boolean;
  
  flexCol?: boolean;
  flexColumn?: boolean;
  flexColRev?: boolean;
  flexColumnRev?: boolean;
  flexColumnReverse?: boolean;
  
  flexDir?: ViewStyle['flexDirection'];
  flexDirection?: ViewStyle['flexDirection'];
  
  flex?: ViewStyle['flex'];
  flexWrap?: ViewStyle['flexWrap'];
  flexGrow?: ViewStyle['flexGrow'];
  flexShrink?: ViewStyle['flexShrink'];
  flexBasis?: ViewStyle['flexBasis'];
  
  itemsCenter?: boolean;
  itemsEnd?: boolean;
  itemsStart?: boolean;
  itemsStretch?: boolean;
  alignItems?: ViewStyle['alignItems'];
  
  alignCenter?: boolean;
  alignEnd?: boolean;
  alignStart?: boolean;
  alignStretch?: boolean;
  alignSelf?: ViewStyle['alignSelf'];
  
  jAround?: boolean;
  justifyAround?: boolean;
  justifySpaceAround?: boolean;
  jCenter?: boolean;
  justifyCenter?: boolean;
  jEnd?: boolean;
  justifyEnd?: boolean;
  jEvenly?: boolean;
  justifyEvenly?: boolean;
  justifySpaceEvenly?: boolean;
  jStart?: boolean;
  justifyStart?: boolean;
  jBetween?: boolean;
  justifyBetween?: boolean;
  justifySpaceBetween?: boolean;
  justify?: ViewStyle['justifyContent'];
  justifyContent?: ViewStyle['justifyContent'];
  
  gap?: ViewStyle['gap'];
  rowGap?: ViewStyle['rowGap'];
  colGap?: ViewStyle['columnGap'];
  columnGap?: ViewStyle['columnGap'];
  
  // custom
  touchable?: boolean;
  elevated?: boolean;
  haptic?: boolean;
  inactive?: boolean;
  
  // other
  style?: StyleProp<ViewStyle>;

};

export type ChildlessViewProps = Omit<ViewProps, 'children'>;
