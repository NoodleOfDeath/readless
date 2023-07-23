import React from 'react';
import { LayoutRectangle } from 'react-native';

import FastImage, { FastImageProps } from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';

import { View, ViewProps } from '~/components';
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
  source,
  ...props 
}: ImageProps) {
  const style = useStyles(props);
  const [shouldFallback, setShouldFallback] = React.useState(false);
  const [layout, setLayout] = React.useState<LayoutRectangle>();
  if (/\.svg/.test(source.uri || '')) {
    return (
      <View
        flexGrow={ 1 } 
        onLayout={ (e) => setLayout(e.nativeEvent.layout) }>
        <SvgUri 
          viewBox={ `0 0 ${layout?.width ?? 0} ${layout?.height ?? 0}` }
          uri={ source.uri } 
          width={ layout?.width ?? 0 } 
          height={ layout?.height ?? 0 } />
      </View>
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