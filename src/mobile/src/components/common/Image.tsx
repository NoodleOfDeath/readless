import React from 'react';

import FastImage, { FastImageProps } from 'react-native-fast-image';

import { VIEW_STYLE_PROPS, ViewStyleProps } from '~/components';
import { useStyles } from '~/hooks';

export type ImageProps = FastImageProps & Omit<ViewStyleProps, 'children' | 'center'> & {
  fill?: boolean;
  stretch?: boolean;
  center?: boolean;
};

export function Image({ 
  fill, 
  stretch,
  center,
  ...props 
}: ImageProps) {
  const style = useStyles(props, { onlyInclude: VIEW_STYLE_PROPS });
  return (
    <FastImage 
      { ...props } 
      resizeMode={ props.resizeMode ?? fill ? 'cover' : stretch ? 'stretch' : center ? 'center' : 'contain' }
      style={ style } />
  );
}