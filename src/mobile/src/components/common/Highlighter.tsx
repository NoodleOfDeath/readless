import React from 'react';

import RNHighlighter from 'react-native-highlight-words';
import { HighlighterProps as RNHighlighterProps } from 'react-native-highlight-words';

import { ViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type HighlighterProps = Omit<RNHighlighterProps & ViewProps, 'children' | 'textToHighlight'> & {
  children?: string;
};

export function Highlighter({ children, ...props }: HighlighterProps) {
  const style = useStyles(props);
  return (
    <RNHighlighter
      { ...props } 
      textToHighlight={ children ?? '' }
      style={ style } />
  );
}