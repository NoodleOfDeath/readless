import React from 'react';

import { Surface as RNPSurface, SurfaceProps as RNPSurfaceProps  } from 'react-native-paper';

import { ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type SurfaceProps = ViewProps & RNPSurfaceProps & React.PropsWithChildren;

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