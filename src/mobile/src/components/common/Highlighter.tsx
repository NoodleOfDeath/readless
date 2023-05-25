import React from 'react';

import RNHighlighter from 'react-native-highlight-words';
import { HighlighterProps as RNHighlighterProps } from 'react-native-highlight-words';

import { ViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type HighlighterProps = RNHighlighterProps & Omit<ViewProps, 'children'>;

export function Highlighter(props: HighlighterProps) {
  const style = useStyles(props);
  return (
    <RNHighlighter
      { ...props } 
      numberOfLines={ 100 }
      style={ style } />
  );
}