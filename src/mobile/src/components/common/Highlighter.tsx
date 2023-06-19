import React from 'react';

import RNHighlighter from 'react-native-highlight-words';
import { HighlighterProps as RNHighlighterProps } from 'react-native-highlight-words';

import {
  ChildlessViewProps,
  TextProps,
  View,
} from '~/components';
import { useTextStyles } from '~/hooks';

export type HighlighterProps = Omit<RNHighlighterProps & TextProps & ChildlessViewProps, 'children' | 'textToHighlight'> & {
  children?: string;
};

export function Highlighter({ children, ...props }: HighlighterProps) {
  const textStyle = useTextStyles(props);
  return (
    <View { ...props }>
      <RNHighlighter
        { ...props } 
        textToHighlight={ children ?? '' }
        style={ textStyle } />
    </View>
  );
}