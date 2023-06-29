import React from 'react';
import { Platform } from 'react-native';

import {
  AVAILABLE_FONTS,
  BASE_LETTER_SPACING,
  BASE_LINE_HEIGHT_MULTIPLIER,
  DEFAULT_PREFERRED_FONT,
  FONT_SIZES,
  FontFamily,
  SYSTEM_FONT,
  TextProps,
  ViewProps,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useTheme } from '~/hooks';

export function useTextStyles({
  
  // typographies (aka variants)
  caption,
  subscript,
  subtitle1,
  subtitle2,
  body1,
  body2,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  
  // font and size
  system,
  font,
  fontFamily = font,
  fontSize = caption ? FONT_SIZES.caption : subscript ? FONT_SIZES.subscript : subtitle1 ? FONT_SIZES.subtitle1 : subtitle2 ? FONT_SIZES.subtitle2 : body1 ? FONT_SIZES.body1 : body2 ? FONT_SIZES.body2 : h1 ? FONT_SIZES.h1 : h2 ? FONT_SIZES.h2 : h3 ? FONT_SIZES.h3 : h4 ? FONT_SIZES.h4 : h5 ? FONT_SIZES.h5 : h6 ? FONT_SIZES.h6 : FONT_SIZES.body1,
  adaptive,
  adjustsFontSizeToFit = adaptive,
  fontSizeFixed = adjustsFontSizeToFit,
  
  // Spacing and height
  letterSpacing,
  lineHeight,
  
  // alignment
  textCenter,
  textLeft,
  textRight,
  textAlign = textCenter ? 'center' : textLeft ? 'left' : textRight ? 'right' : undefined,
  
  // style and color
  bold,
  italic,
  underline,
  capitalize,

  fontWeight = bold ? 'bold' : undefined,
  textTransform = capitalize ? 'capitalize' : undefined,
  textDecorationLine = underline ? 'underline' : undefined,
  fontStyle = italic ? 'italic' : undefined,

  color = 'text',
}: TextProps) {
  
  const { 
    fontFamily: fontFamily0 = DEFAULT_PREFERRED_FONT, 
    fontSizeOffset = 0,
    letterSpacing: letterSpacing0 = 0,
    lineHeightMultiplier = 0,
  } = React.useContext(SessionContext);
  
  const theme = useTheme();
  
  return React.useMemo(() => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attrs: any[] = [];
    
    const offsetFontSize = fontSize + (fontSizeFixed ? 0 : fontSizeOffset);
    const computedFont = system ? SYSTEM_FONT : !AVAILABLE_FONTS.includes(fontFamily ?? fontFamily0 as FontFamily) ? DEFAULT_PREFERRED_FONT : fontFamily ?? fontFamily0;
    
    const platformFont = Platform.select({
      android: [computedFont, [fontWeight ? 'Bold' : undefined, fontStyle ? 'Italic' : undefined].filter(Boolean).join('') || 'Regular'].join('-'),
      ios: computedFont,
    }) ?? computedFont;
    
    const platformWeight = Platform.select({
      android: undefined,
      ios: fontWeight,
    });
    
    const platformStyle = Platform.select({
      android: undefined,
      ios: fontStyle,
    });
    
    attrs.push({ fontFamily: platformFont });
    attrs.push({ fontSize: offsetFontSize });
    
    attrs.push({ letterSpacing: BASE_LETTER_SPACING + (letterSpacing ?? letterSpacing0) });
    attrs.push({ lineHeight: ((lineHeight ?? offsetFontSize) * (BASE_LINE_HEIGHT_MULTIPLIER + lineHeightMultiplier)) });
    
    attrs.push(textAlign ? { textAlign } : undefined);
    
    attrs.push(platformWeight ? { fontWeight: platformWeight } : undefined);
    attrs.push(platformStyle ? { fontStyle: platformStyle } : undefined);
    attrs.push(textDecorationLine ? { textDecorationLine } : undefined);

    attrs.push(textTransform ? { textTransform } : undefined);

    attrs.push(color ? { color: Object.keys(theme.colors).includes(color as keyof typeof theme.colors) ? theme.colors[color as keyof typeof theme.colors] : color } : undefined);
  
    return attrs.filter((v) => v !== undefined).reduce((acc, val) => ({ ...acc, ...val }), {});
    
  }, [fontSize, fontSizeFixed, fontSizeOffset, system, fontFamily, fontFamily0, letterSpacing, letterSpacing0, lineHeight, lineHeightMultiplier, textAlign, fontWeight, fontStyle, textDecorationLine, textTransform, color, theme]);
  
}

export function useStyles({
  
  // preset variants
  outlined,
  rounded,
  
  // position
  absolute,
  relative,
  pos = absolute ? 'absolute' : relative ? 'relative' : undefined,
  position = pos,
  t,
  top = t,
  b,
  bottom = b,
  l,
  left = l,
  r,
  right = r,
  z,
  zIndex = z,
  
  // dimensions
  aspect,
  aspectRatio = aspect,
  w,
  width = w,
  h,
  height = h,
  minW,
  minWidth = minW,
  minH,
  minHeight = minH,
  maxW,
  maxWidth = maxW,
  maxH,
  maxHeight = maxH,
  
  // margin
  m,
  margin = m,
  mx = margin,
  my = margin,
  ml = mx,
  marginLeft = ml,
  mr = mx,
  marginRight = mr,
  mt = my,
  marginTop = mt,
  mb = my,
  marginBottom = mb,
  
  // padding
  p,
  padding = p,
  px = padding,
  py = padding,
  pl = px,
  paddingLeft = pl,
  pr = px,
  paddingRight = pr,
  pt = py,
  paddingTop = pt,
  pb = py,
  paddingBottom = pb,
  
  // appearance
  bg,
  bgColor = bg,
  backgroundColor = bgColor,
  opacity,
  overflow,
  
  // border color
  bColor,
  borderColor = bColor,
  bcTop = borderColor,
  borderTopColor = bcTop,
  bcRight = borderColor,
  borderRightColor = bcRight,
  bcBottom = borderColor,
  borderBottomColor = bcBottom,
  bcLeft = borderColor,
  borderLeftColor = bcLeft,
  
  // border radius
  bRadius = rounded ? 6 : undefined,
  borderRadius = bRadius,
  brTopLeft = borderRadius,
  borderTopLeftRadius = brTopLeft,
  brTopRight = borderRadius,
  borderTopRightRadius = brTopRight,
  brBottomLeft = borderRadius,
  borderBottomLeftRadius = brBottomLeft,
  brBottomRight = borderRadius,
  borderBottomRightRadius = brBottomRight,
  
  // border width
  bWidth = outlined || borderColor ? 1 : undefined,
  borderWidth = bWidth,
  bwTop = borderWidth,
  borderTopWidth = bwTop,
  bwRight = borderWidth,
  borderRightWidth = bwRight,
  bwBottom = borderWidth,
  borderBottomWidth = bwBottom,
  bwLeft = borderWidth,
  borderLeftWidth = bwLeft,
  
  // flex
  col,
  colRev,
  row,
  rowRev,
  
  flexRow = row,
  flexRowRev = rowRev,
  flexRowReverse = flexRowRev,
  
  flexCol = col,
  flexColumn = flexCol,
  flexColRev = colRev,
  flexColumnRev = flexColRev,
  flexColumnReverse = flexColumnRev,
  
  flexDir = flexRow ? 'row' : flexRowReverse ? 'row-reverse' : flexColumn ? 'column' : flexColumnReverse ? 'column-reverse' : undefined,
  flexDirection = flexDir,
  
  flex = col || colRev || row || rowRev ? 1 : undefined,
  flexWrap,
  flexGrow = flex,
  flexShrink = undefined,
  flexBasis = flex ? 0 : undefined,
  
  itemsCenter,
  itemsEnd,
  itemsStart,
  itemsStretch,
  alignItems = itemsCenter ? 'center' : itemsEnd ? 'flex-end' : itemsStart ? 'flex-start' : itemsStretch ? 'stretch' : undefined,
  
  alignCenter,
  alignEnd,
  alignStart,
  alignStretch,
  alignSelf = alignCenter ? 'center' : alignEnd ? 'flex-end' : alignStart ? 'flex-start' : alignStretch ? 'stretch' : undefined,
  
  jAround,
  justifyAround = jAround,
  justifySpaceAround = justifyAround,
  jCenter,
  justifyCenter = jCenter,
  jEnd,
  justifyEnd = jEnd,
  jEvenly,
  justifyEvenly = jEvenly,
  justifySpaceEvenly = justifyEvenly,
  jStart,
  justifyStart = jStart,
  jBetween,
  justifyBetween = jBetween,
  justifySpaceBetween = justifyBetween,
  justify = justifySpaceAround ? 'space-around' : justifyCenter ? 'center' : justifyEnd ? 'flex-end' : justifySpaceEvenly ? 'space-evenly' : justifyStart ? 'flex-start' : justifySpaceBetween ? 'space-between' : undefined,
  justifyContent = justify,
  
  gap,
  rowGap = gap,
  colGap = gap,
  columnGap = colGap,
  
  // other
  style,
} : ViewProps) {

  const theme = useTheme();
  
  const outlineStyle = React.useMemo(() => {
    if (!outlined) {
      return undefined; 
    }
    return theme.components.outlined;
  }, [outlined, theme.components.outlined]);
  
  const viewStyle = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attrs: any[] = [];
    // position
    attrs.push(position ? { position } : undefined);
    attrs.push(top ? { top } : undefined);
    attrs.push(left ? { left } : undefined);
    attrs.push(right ? { right } : undefined);
    attrs.push(bottom ? { bottom } : undefined);
    attrs.push(zIndex ? { zIndex }: undefined);
    
    // dimensions
    attrs.push(aspectRatio ? { aspectRatio } : undefined);
    attrs.push(width ? { width } : undefined);
    attrs.push(height ? { height } : undefined);
    attrs.push(minWidth ? { minWidth } : undefined);
    attrs.push(minHeight ? { minHeight } : undefined);
    attrs.push(maxWidth ? { maxWidth } : undefined);
    attrs.push(maxHeight ? { maxHeight } : undefined);
    
    // margin
    attrs.push(marginTop ? { marginTop } : undefined);
    attrs.push(marginBottom ? { marginBottom } : undefined);
    attrs.push(marginLeft ? { marginLeft } : undefined);
    attrs.push(marginRight ? { marginRight } : undefined);
    
    // padding
    attrs.push(paddingTop ? { paddingTop } : undefined);
    attrs.push(paddingBottom ? { paddingBottom } : undefined);
    attrs.push(paddingLeft ? { paddingLeft } : undefined);
    attrs.push(paddingRight ? { paddingRight } : undefined);
    
    // appearance
    attrs.push(backgroundColor ? { backgroundColor } : undefined);
    attrs.push(opacity ? { opacity } : undefined);
    attrs.push(overflow ? { overflow } : undefined);
    
    // border width
    attrs.push(borderTopWidth ? { borderTopWidth } : undefined);
    attrs.push(borderBottomWidth ? { borderBottomWidth } : undefined);
    attrs.push(borderLeftWidth ? { borderLeftWidth } : undefined);
    attrs.push(borderRightWidth ? { borderRightWidth } : undefined);
    
    // border color
    attrs.push(borderTopColor ? { borderTopColor } : undefined);
    attrs.push(borderBottomColor ? { borderBottomColor } : undefined);
    attrs.push(borderLeftColor ? { borderLeftColor } : undefined);
    attrs.push(borderRightColor ? { borderRightColor } : undefined);
    
    // border radius
    attrs.push(borderTopLeftRadius ? { borderTopLeftRadius } : undefined);
    attrs.push(borderTopRightRadius ? { borderTopRightRadius } : undefined);
    attrs.push(borderBottomLeftRadius ? { borderBottomLeftRadius } : undefined);
    attrs.push(borderBottomRightRadius ? { borderBottomRightRadius } : undefined);
    
    // flex
    attrs.push(flexDirection ? { flexDirection } : undefined);
    
    attrs.push(flex ? { flex } : undefined);
    attrs.push(flexWrap ? { flexWrap } : undefined);
    attrs.push(flexGrow ? { flexGrow } : undefined);
    attrs.push(flexShrink ? { flexShrink } : undefined);
    attrs.push(flexBasis ? { flexBasis } : undefined);
    
    attrs.push(alignItems ? { alignItems } : undefined);
    attrs.push(alignSelf ? { alignSelf } : undefined);
    attrs.push(justifyContent ? { justifyContent } : undefined);
    
    attrs.push(rowGap ? { rowGap } : undefined);
    attrs.push(columnGap ? { columnGap } : undefined);
    
    return attrs.filter((v) => v !== undefined).reduce((acc, val) => ({ ...acc, ...val }), style ?? {});
    
  }, [position, top, left, right, bottom, zIndex, aspectRatio, width, height, minWidth, minHeight, maxWidth, maxHeight, marginTop, marginBottom, marginLeft, marginRight, paddingTop, paddingBottom, paddingLeft, paddingRight, backgroundColor, opacity, overflow, borderTopWidth, borderBottomWidth, borderLeftWidth, borderRightWidth, borderTopColor, borderBottomColor, borderLeftColor, borderRightColor, borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius, flexDirection, flex, flexWrap, flexGrow, flexShrink, flexBasis, alignItems, alignSelf, justifyContent, rowGap, columnGap, style]);

  const allStyles = React.useMemo(() => {
    return { ...viewStyle, ...outlineStyle };
  }, [viewStyle, outlineStyle]);

  return allStyles;

}