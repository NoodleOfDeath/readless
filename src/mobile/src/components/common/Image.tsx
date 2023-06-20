import React from 'react';

import FastImage, { FastImageProps } from 'react-native-fast-image';

import { ViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type ImageProps = FastImageProps & Omit<ViewProps, 'children' | 'center'> & {
  contain?: boolean;
  stretch?: boolean;
  center?: boolean;
};

export function Image({ 
  contain, 
  stretch,
  center,
  resizeMode = contain ? 'contain' : stretch ? 'stretch' : center ? 'center' : 'cover',
  ...props 
}: ImageProps) {
  const style = useStyles(props);
  return (
    <FastImage 
      { ...props }
      resizeMode={ resizeMode }
      style={ style } />
  );
}