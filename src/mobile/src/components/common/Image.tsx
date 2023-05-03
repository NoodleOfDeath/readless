import React from 'react';
import { Image as RNImage, ImageProps as RNImageProps } from 'react-native';

import { VIEW_STYLE_PROPS, ViewStyleProps } from '~/components';
import { useStyles } from '~/hooks';

export type ImageProps = RNImageProps & Omit<ViewStyleProps, 'children'>;

export function Image(props: ImageProps) {
  const style = useStyles(props, { onlyInclude: VIEW_STYLE_PROPS });
  return (
    <RNImage { ...props } style={ style } />
  );
}