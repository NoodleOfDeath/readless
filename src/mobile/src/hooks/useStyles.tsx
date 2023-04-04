import React from 'react';

import { Stylable } from '~/components';
import { useTheme } from '~/hooks';

export function useStyles({
  col,
  row,
  center,
  left,
  right,
  m,
  mt = m,
  mb = m,
  ml = m,
  mr = m,
  p,
  pt = p,
  pb = p,
  pl = p,
  pr = p,
  outlined,
  contained,
  width,
  rounded,
  style,
}: Stylable) {
  const theme = useTheme();
  
  const newStyle = React.useMemo(() => ({ ...style }), [style]);
  
  const alignment = React.useMemo(() => {
    if (center) {
      return {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      };
    } 
    if (right) {
      return {
        justifyContent: 'flex-end',
        textAlign: 'right',
      };
    }
    if (left) {
      return {
        justifyContent: 'flex-start',
        textAlign: 'left',
      };
    }
    return { textAlign: 'left' };
  }, [center, left, right]);
  
  const appearance = React.useMemo(() => {
    if (outlined) {
      return theme.components.outlined;
    } else
    if (contained) {
      return theme.components.buttonSelected;
    }
  }, [outlined, contained, theme]);
  
  const viewStyle = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attrs: any[] = [];
    attrs.push(row
      ? theme.components.flexRow
      : col
        ? theme.components.flexCol
        : undefined);
    attrs.push(alignment);
    attrs.push(appearance);
    attrs.push({ width });
    if (rounded) {
      attrs.push(theme.components.rounded);
    }
    if (mt) {
      attrs.push({ marginTop: mt });
    }
    if (mb) {
      attrs.push({ marginBottom: mb });
    }
    if (ml) {
      attrs.push({ marginLeft: ml });
    }
    if (mr) {
      attrs.push({ marginRight: mr });
    }
    if (pt) {
      attrs.push({ paddingTop: pt });
    }
    if (pb) {
      attrs.push({ paddingBottom: pb });
    }
    if (pl) {
      attrs.push({ paddingLeft: pl });
    }
    if (pr) {
      attrs.push({ paddingRight: pr });
    }
    return attrs
      .filter(Boolean)
      .flat()
      .reduce((acc, attr) => ({ ...acc, ...attr }), newStyle);
  }, [row, theme.components.flexRow, theme.components.flexCol, theme.components.rounded, col, alignment, appearance, width, rounded, mt, mb, ml, mr, pt, pb, pl, pr, newStyle]);
  return viewStyle;
}