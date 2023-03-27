import React from 'react';

import LinearGradient, { LinearGradientProps } from 'react-native-linear-gradient';

import { useTheme } from '../theme';

type Props = Omit<LinearGradientProps, 'colors' | 'style'> & {
  row?: boolean;
  col?: boolean;
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
  colors?: string[];
  style?: React.ComponentProps<typeof LinearGradient>['style'] & {
    background?: string | string[];
  };
};

export default function FlexView({
  children,
  row,
  col,
  colors = ['transparent', 'transparent'],
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
  style,
  ...props
}: Props) {
  const theme = useTheme();
  if (style?.background) {
    colors = Array.isArray(style.background)
      ? style.background
      : [style.background, style.background];
    delete style.background;
  }
  const viewStyle = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attrs: any[] = [];
    attrs.push(row
      ? theme.components.flexRow
      : col
        ? theme.components.flexCol
        : undefined);
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
      .reduce((acc, attr) => ({ ...acc, ...attr }), style ?? {});
  }, [row, theme.components.flexRow, theme.components.flexCol, col, mt, mb, ml, mr, pt, pb, pl, pr, style]);
  return (
    <LinearGradient colors={ colors } { ...{ ...props, style: viewStyle } }>
      {children}
    </LinearGradient>
  );
}
