import React from 'react';

import RNHighlighter from 'react-native-highlight-words';
import { HighlighterProps as RNHighlighterProps } from 'react-native-highlight-words';

import {
  Chip,
  ChipProps,
  TextProps,
  View,
} from '~/components';
import { useTextStyles } from '~/hooks';

export type HighlighterProps = Omit<RNHighlighterProps & TextProps & ChipProps, 'children' | 'textToHighlight'> & {
  children?: string;
};

export function Highlighter({ children, ...props }: HighlighterProps) {
  const textStyle = useTextStyles(props);
  return (
    <Chip { ...props }>
      <RNHighlighter
        { ...props }
        textToHighlight={ children ?? '' }
        style={ textStyle } />
    </Chip>
  );
}