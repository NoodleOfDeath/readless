import React from 'react';
import { Image as RNImage, ImageProps as RNImageProps } from 'react-native';

import FastImage, { FastImageProps } from 'react-native-fast-image';

import { ViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type ImageProps = RNImageProps & FastImageProps & Omit<ViewProps, 'children'> & {
  native?: boolean;
  contain?: boolean;
  stretch?: boolean;
  center?: boolean;
  height?: number;
  fallbackComponent?: React.ReactNode;
};

export function Image({
  native,
  contain, 
  stretch,
  center,
  resizeMode = contain ? 'contain' : stretch ? 'stretch' : center ? 'center' : 'cover',
  fallbackComponent,
  source,
  ...props 
}: ImageProps) {
  
  const style = useStyles(props);
  const [shouldFallback, setShouldFallback] = React.useState(false);
  
  if (native) {
    return (
      <RNImage
        source={ source }
        { ...props }
        resizeMode={ resizeMode }
        style={ style } />
    );
  }

  return shouldFallback ? fallbackComponent : (
    <FastImage 
      onError={ () => setShouldFallback(true) }
      source={ source }
      { ...props }
      resizeMode={ resizeMode }
      style={ style } />
  );
  
}