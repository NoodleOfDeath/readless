import React from 'react';

import { Stylable } from '~/components';
import { SessionContext } from '~/contexts';
import { useTheme } from '~/hooks';

export function useStyles({
  // dimensions
  width,
  height,
  // typographies
  caption,
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
  color,
  center,
  left,
  right,
  fontSize = h1 ? 36 : h2 ? 32 : h3 ? 28 : h4 ? 26 : h5 ? 24 : h6 ? 22 : caption ? 12 : subtitle1 ? 20 : subtitle2 ? 18 : body1 ? 16 : body2 ? 15 : 16,
  bold,
  italic,
  underline,
  code,
  // flex styles
  col,
  row,
  alignCenter,
  alignEnd,
  alignStart,
  justifyCenter,
  justifyEnd,
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
  // appearance
  bg,
  outlined,
  contained,
  rounded,
  // selectable,
  // other
  style,
}: Stylable) {
  const theme = useTheme();
  
  const { preferences: { textScale } } = React.useContext(SessionContext);
  const newStyle = React.useMemo(() => ({ ...style }), [style]);
  
  const textAlign = React.useMemo(() => {
    if (center) {
      return { textAlign: 'center' };
    } 
    if (right) {
      return { textAlign: 'right' };
    }
    if (left) {
      return { textAlign: 'left' };
    }
  }, [center, left, right]);

  const fontAppearance = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const styles: any[] = [];
    if (bold) {
      styles.push({ fontWeight: 'bold' });
    }
    if (italic) {
      styles.push({ fontStyle: 'italic' });
    }
    if (underline) {
      styles.push({ textDecorationLine: 'underline' });
    }
    if (code) {
      styles.push({ fontFamily: 'monospace' });
    }
    return styles.reduce((cur, n) => ({ ...cur, ...n }), {});
  }, [bold, italic, underline, code]);

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
    if (justifySpaced) {
      return { justifyContent: 'space-between' };
    }
  }, [justifyCenter, justifyEnd, justifySpaced, justifyStart]);
  
  const appearance = React.useMemo(() => {
    if (outlined === true) {
      return theme.components.outlined;
    } else
    if (typeof outlined === 'string') {
      return { borderColor: outlined, borderWidth: 1 };
    } else
    if (typeof outlined === 'number') {
      return { borderColor: theme.colors.primary, borderWidth: outlined };
    } else
    if (Array.isArray(outlined) && outlined.length === 2 && typeof outlined[0] === 'string' && typeof outlined[1] === 'number') {
      return {
        borderColor: outlined[0],
        borderWidth: outlined[1],
      };
    } else
    if (contained) {
      return theme.components.buttonSelected;
    } 
  }, [outlined, contained, theme]);

  const viewStyle = React.useMemo(() => {
    const scale = ((((textScale ?? 1) - 1) / 2) + 1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attrs: any[] = [];
    attrs.push(row? theme.components.flexRow : undefined);
    attrs.push(col ? theme.components.flexCol : undefined);
    attrs.push(textAlign);
    attrs.push(fontAppearance);
    attrs.push(alignItems);
    attrs.push(justifyContent);
    attrs.push(appearance);
    attrs.push(color ? { color }: undefined);
    attrs.push(width ? { width }: undefined);
    attrs.push(height ? { height }: undefined);
    attrs.push(fontSize ? { fontSize }: undefined);
    attrs.push(bg ? { backgroundColor: bg } : undefined);
    attrs.push(rounded ? theme.components.rounded : undefined);
    attrs.push(mt ? { marginTop: mt * scale } : undefined);
    attrs.push(mb ? { marginBottom: mb * scale } : undefined);
    attrs.push(ml ? { marginLeft: ml * scale } : undefined);
    attrs.push(mr ? { marginRight: mr * scale } : undefined);
    attrs.push(pt ? { paddingTop: pt * scale } : undefined);
    attrs.push(pb ? { paddingBottom: pb * scale } : undefined);
    attrs.push(pl ? { paddingLeft: pl * scale } : undefined);
    attrs.push(pr ? { paddingRight: pr * scale } : undefined);
    return attrs.filter(Boolean).reduce((acc, val) => ({ ...acc, ...val }), newStyle ?? {});
  }, [
    textScale,
    width,
    height,
    color,
    fontSize,
    fontAppearance,
    row, 
    col, 
    textAlign,
    alignItems,
    justifyContent,
    mt, mb, ml, mr, 
    pt, pb, pl, pr, 
    bg,
    rounded, 
    appearance, 
    theme.components.flexRow, 
    theme.components.flexCol,
    theme.components.rounded, 
    newStyle,
  ]);
  return viewStyle;
}