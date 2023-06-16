import React from 'react';

import {
  AVAILABLE_FONTS,
  FONT_SIZES,
  Stylable,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useTheme } from '~/hooks';

export type UseStylesOptions = {
  onlyInclude?: string[];
};

export function useStyles({
  // position
  absolute,
  relative,
  top,
  bottom,
  left,
  right,
  // dimensions
  aspectRatio,
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  // typographies
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
  // text styles
  color = 'text',
  textCenter,
  textLeft,
  textRight,
  fontFamily,
  fontSize = caption ? FONT_SIZES.caption : subscript ? FONT_SIZES.subscript : subtitle1 ? FONT_SIZES.subtitle1 : subtitle2 ? FONT_SIZES.subtitle2 : body1 ? FONT_SIZES.body1 : body2 ? FONT_SIZES.body2 : h1 ? FONT_SIZES.h1 : h2 ? FONT_SIZES.h2 : h3 ? FONT_SIZES.h3 : h4 ? FONT_SIZES.h4 : h5 ? FONT_SIZES.h5 : h6 ? FONT_SIZES.h6 : FONT_SIZES.body1,
  fontSizeFixed,
  letterSpacing = 0.15,
  lineHeight = fontSize * 1.35,
  bold,
  italic,
  underline,
  // flex styles
  flex,
  flexWrap,
  flexGrow,
  flexRow,
  flexRowReverse,
  flexColumn,
  flexColumnReverse,
  gap,
  rowGap = gap,
  colGap = gap,
  col,
  row,
  alignCenter,
  alignEnd,
  alignStart,
  justifyCenter,
  justifyEnd,
  justifyEvenly,
  justifyStart,
  justifySpaced,
  // margin
  m,
  mh = m,
  mv = m,
  mt = mv,
  mb = mv,
  ml = mh,
  mr = mh,
  // padding
  p,
  ph = p,
  pv = p,
  pt = pv,
  pb = pv,
  pl = ph,
  pr = ph,
  // border
  borderColor,
  borderTopColor = borderColor,
  borderRightColor = borderColor,
  borderBottomColor = borderColor,
  borderLeftColor = borderColor,
  borderRadius,
  borderRadiusTL: borderTopLeftRadius = borderRadius,
  borderRadiusTR: borderTopRightRadius = borderRadius,
  borderRadiusBL: borderBottomLeftRadius = borderRadius,
  borderRadiusBR: borderBottomRightRadius = borderRadius,
  borderWidth = borderColor ? 1 : undefined,
  borderTopWidth = borderWidth,
  borderRightWidth = borderWidth,
  borderBottomWidth = borderWidth,
  borderLeftWidth = borderWidth,
  // appearance
  bg,
  opacity,
  outlined,
  contained,
  rounded,
  overflow,
  zIndex,
  // other
  style,
} : Stylable, { onlyInclude }: UseStylesOptions = {}) {
  const theme = useTheme();
  
  const { fontFamily: preferredFont = 'Faustina', fontSizeOffset = 0 } = React.useContext(SessionContext);

  const position = React.useMemo(() => {
    if (absolute) {
      return { position: 'absolute' };
    }
    if (relative) {
      return { position: 'relative' };
    }
  }, [absolute, relative]);
  
  const textAlign = React.useMemo(() => {
    if (textLeft) {
      return { textAlign: 'left' };
    }
    if (textCenter) {
      return { textAlign: 'center' };
    } 
    if (textRight) {
      return { textAlign: 'right' };
    }
  }, [textLeft, textCenter, textRight]);
  
  const alignItems = React.useMemo(() => {
    if (alignCenter) {
      return { alignItems: 'center' };
    }
    if (alignStart) {
      return { alignItems: 'flex-start' };
    }
    if (alignEnd) {
      return { alignItems: 'flex-end' };
    }
  }, [alignCenter, alignEnd, alignStart]);

  const justifyContent = React.useMemo(() => {
    if (justifyCenter) {
      return { justifyContent: 'center' };
    }
    if (justifyStart) {
      return { justifyContent: 'flex-start' };
    }
    if (justifyEnd) {
      return { justifyContent: 'flex-end' };
    }
    if (justifyEvenly) {
      return { justifyContent: 'space-evenly' };
    }
    if (justifySpaced) {
      return { justifyContent: 'space-between' };
    }
  }, [justifyCenter, justifyEnd, justifySpaced, justifyEvenly, justifyStart]);
  
  const appearance = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appearance: any[] = [];
    if (outlined === true) {
      appearance.push(theme.components.outlined);
    } else
    if (typeof outlined === 'string') {
      appearance.push({ borderColor: outlined, borderWidth: 1 });
    } else
    if (typeof outlined === 'number') {
      appearance.push({ borderColor: theme.colors.primary, borderWidth: outlined });
    } else
    if (Array.isArray(outlined) && outlined.length === 2 && typeof outlined[0] === 'string' && typeof outlined[1] === 'number') {
      appearance.push({
        borderColor: outlined[0],
        borderWidth: outlined[1],
      });
    } else
    if (contained) {
      appearance.push(theme.components.buttonSelected);
    }
    if (opacity) {
      appearance.push({ opacity });
    }
    if (overflow) {
      appearance.push({ overflow });
    }
    return appearance.reduce((cur, n) => ({ ...cur, ...n }), {});
  }, [opacity, outlined, contained, theme, overflow]);

  const viewStyle = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attrs: any[] = [];
    attrs.push(position ? position : undefined);
    attrs.push(zIndex ? zIndex : undefined);
    attrs.push(top ? { top: typeof top === 'number' ? top : top } : undefined);
    attrs.push(left ? { left: typeof left === 'number' ? left : left } : undefined);
    attrs.push(right ? { right: typeof right === 'number' ? right : right } : undefined);
    attrs.push(bottom ? { bottom: typeof bottom === 'number' ? bottom : bottom } : undefined);
    attrs.push(row ? theme.components.flexRow : undefined);
    attrs.push(col ? theme.components.flexCol : undefined);
    attrs.push(flex ? { flex } : undefined);
    attrs.push(flexWrap ? { flexWrap } : undefined);
    attrs.push(flexGrow ? { flexGrow } : undefined);
    attrs.push(flexRow ? { flexDirection: 'row' } : undefined);
    attrs.push(flexRowReverse ? { flexDirection: 'row-reverse' } : undefined);
    attrs.push(flexColumn ? { flexDirection: 'column' } : undefined);
    attrs.push(flexColumnReverse ? { flexDirection: 'column-reverse' } : undefined);
    attrs.push(rowGap ? { rowGap } : undefined);
    attrs.push(colGap ? { columnGap: colGap } : undefined);
    attrs.push(textAlign);
    attrs.push(bold ? { fontWeight: 'bold' } : undefined);
    attrs.push(italic ? { fontStyle: 'italic' } : undefined);
    attrs.push(underline ? { textDecorationLine: 'underline' } : undefined);
    attrs.push({ fontFamily : !AVAILABLE_FONTS.includes(fontFamily ?? preferredFont ?? '') ? 'Faustina' : fontFamily ?? preferredFont });
    attrs.push({ lineHeight });
    attrs.push({ letterSpacing });
    attrs.push(alignItems);
    attrs.push(justifyContent);
    attrs.push(appearance);
    attrs.push(color ? { color: Object.keys(theme.colors).includes(color) ? theme.colors[color as keyof typeof theme.colors] : color } : undefined);
    attrs.push(aspectRatio ? { aspectRatio } : undefined);
    attrs.push(width ? { width } : undefined);
    attrs.push(height ? { height } : undefined);
    attrs.push(minWidth ? { minWidth } : undefined);
    attrs.push(minHeight ? { minHeight } : undefined);
    attrs.push(maxWidth ? { maxWidth } : undefined);
    attrs.push(maxHeight ? { maxHeight } : undefined);
    attrs.push({ fontSize : fontSize + (fontSizeFixed ? 0 : fontSizeOffset) });
    attrs.push(borderTopWidth ? { borderTopWidth } : undefined);
    attrs.push(borderBottomWidth ? { borderBottomWidth } : undefined);
    attrs.push(borderLeftWidth ? { borderLeftWidth } : undefined);
    attrs.push(borderRightWidth ? { borderRightWidth } : undefined);
    attrs.push(borderTopColor ? { borderTopColor } : undefined);
    attrs.push(borderBottomColor ? { borderBottomColor } : undefined);
    attrs.push(borderLeftColor ? { borderLeftColor } : undefined);
    attrs.push(borderRightColor ? { borderRightColor } : undefined);
    attrs.push(borderTopLeftRadius ? { borderTopLeftRadius } : undefined);
    attrs.push(borderTopRightRadius ? { borderTopRightRadius } : undefined);
    attrs.push(borderBottomLeftRadius ? { borderBottomLeftRadius } : undefined);
    attrs.push(borderBottomRightRadius ? { borderBottomRightRadius } : undefined);
    attrs.push(bg ? { backgroundColor: bg } : undefined);
    attrs.push(rounded ? theme.components.rounded : undefined);
    attrs.push(mt ? { marginTop: mt } : undefined);
    attrs.push(mb ? { marginBottom: mb } : undefined);
    attrs.push(ml ? { marginLeft: ml } : undefined);
    attrs.push(mr ? { marginRight: mr } : undefined);
    attrs.push(pt ? { paddingTop: pt } : undefined);
    attrs.push(pb ? { paddingBottom: pb } : undefined);
    attrs.push(pl ? { paddingLeft: pl } : undefined);
    attrs.push(pr ? { paddingRight: pr } : undefined);
    return attrs.filter((v) => v !== undefined && ((onlyInclude && Object.keys(v).every((e) => onlyInclude.includes(e))) || !onlyInclude)).reduce((acc, val) => ({ ...acc, ...val }), style ?? {});
  }, [position, zIndex, top, left, right, bottom, row, theme, col, flex, flexWrap, flexGrow, flexRow, flexRowReverse, flexColumn, flexColumnReverse, rowGap, colGap, textAlign, bold, italic, underline, fontFamily, preferredFont, lineHeight, letterSpacing, alignItems, justifyContent, appearance, color, aspectRatio, width, height, minWidth, minHeight, maxWidth, maxHeight, fontSize, fontSizeFixed, fontSizeOffset, borderTopWidth, borderBottomWidth, borderLeftWidth, borderRightWidth, borderTopColor, borderBottomColor, borderLeftColor, borderRightColor, borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius, bg, rounded, mt, mb, ml, mr, pt, pb, pl, pr, style, onlyInclude]);
  return viewStyle;
}