import React from 'react';
import { Image as RNImage } from 'react-native';

import FastImage, { FastImageProps } from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';

import { View, ViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type ImageProps = FastImageProps & Omit<ViewProps, 'children' | 'center', 'height'> & {
  contain?: boolean;
  stretch?: boolean;
  center?: boolean;
  height?: number;
  fallbackComponent?: React.ReactNode;
};

export function Image({ 
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
  const [aspectRatio, setAspectRatio] = React.useState(1);
  
  const uri = React.useMemo(() => typeof source !== 'number' ? source?.uri : undefined, [source]);
  
  React.useEffect(() => {
    try {
      RNImage.getSize(uri, (width, height) => {
        if (!width || !height) {
          return;
        }
        setAspectRatio(width / height);
      });
    } catch (e) {
      console.error(e);
    }
  }, []);
  
  return shouldFallback ? fallbackComponent : (
    <FastImage 
      onError={ () => setShouldFallback(true) }
      source={ source }
      aspectRatio={ aspectRatio }
      { ...props }
      resizeMode={ resizeMode }
      style={ style } />
  );
  
}