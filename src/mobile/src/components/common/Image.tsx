import React from 'react';

import FastImage, { FastImageProps } from 'react-native-fast-image';

import { ViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type ImageProps = FastImageProps & Omit<ViewProps, 'children' | 'center'> & {
  contain?: boolean;
  stretch?: boolean;
  center?: boolean;
  fallbackComponent?: React.ReactNode;
};

export function Image({ 
  contain, 
  stretch,
  center,
  resizeMode = contain ? 'contain' : stretch ? 'stretch' : center ? 'center' : 'cover',
  fallbackComponent,
  ...props 
}: ImageProps) {
  const style = useStyles(props);
  const [shouldFallback, setShouldFallback] = React.useState(false);
  return shouldFallback ? fallbackComponent : (
    <FastImage 
      onError={ () => setShouldFallback(true) }
      { ...props }
      resizeMode={ resizeMode }
      style={ style } />
  );
}