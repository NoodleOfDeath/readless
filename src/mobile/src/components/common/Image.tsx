import React from 'react';
import {
  ImageBackground,
  Image as RNImage,
  ImageProps as RNImageProps,
} from 'react-native';

import { VIEW_STYLE_PROPS, ViewStyleProps } from '~/components';
import { useStyles } from '~/hooks';

export type ImageProps = RNImageProps & Omit<ViewStyleProps, 'children'> & {
  fill?: boolean;
};

export function Image({ fill, ...props }: ImageProps) {
  const style = useStyles(props, { onlyInclude: VIEW_STYLE_PROPS });
  return fill ? (
    <ImageBackground 
      { ...props } 
      resizeMode="cover"
      style={ style } />
  ) : (
    <RNImage { ...props } style={ style } />
  );
}