import React from 'react';

import { Surface as RNPSurface, SurfaceProps as RNPSurfaceProps  } from 'react-native-paper';

import { Stylable } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type SurfaceProps = Stylable & RNPSurfaceProps & React.PropsWithChildren;

export function Surface({
  children,
  ...surfaceProps
}: SurfaceProps) {
  const theme = useTheme();
  const style = { ...theme.components.surface, ...useStyles(surfaceProps) };
  return (
    <RNPSurface 
      { ...surfaceProps }
      style={ style }>
      {children}
    </RNPSurface>
  );
}