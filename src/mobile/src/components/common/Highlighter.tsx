import React from 'react';

import RNHighlighter from 'react-native-highlight-words';
import { HighlighterProps as RNHighlighterProps } from 'react-native-highlight-words';

import { ChildlessViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type HighlighterProps = Omit<RNHighlighterProps & ChildlessViewProps, 'children' | 'textToHighlight'> & {
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