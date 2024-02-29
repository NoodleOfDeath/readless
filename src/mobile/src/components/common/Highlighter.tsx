import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';

import { findAll } from 'highlight-words-core';

import {
  ChildlessViewProps,
  Text,
  TextProps,
} from '~/components';

export type HighlighterProps = Omit<ChildlessViewProps & TextProps, 'children'> & {
  children?: string;
  autoEscape?: boolean;
  highlightStyle?: TextStyle | ((text: string, index: number) => TextStyle);
  searchWords?: string[];
  sanitize?: () => string;
  propsFor?: (text: string, index: number) => TextProps;
  replacementFor?: (text: string, index: number) => string;
  sentenceCase?: boolean;
};

export function Highlighter({ 
  children = '', 
  highlightStyle,
  searchWords = [],
  propsFor,
  replacementFor,
  sentenceCase,
  ...props
}: HighlighterProps) {
  const textToHighlight = React.useMemo(() => sentenceCase ? children?.replace(/^\w/, ($0) => $0.toUpperCase()) : children, [sentenceCase, children]);
  const chunks = findAll({
    searchWords,
    textToHighlight, 
    ...props, 
  });
  let count = 0;
  return (
    <Text { ...props }>
      <RNText>
        {chunks.map((chunk, index) => {
          const text = textToHighlight?.slice(chunk.start, chunk.end);
          if (chunk.highlight) {
            count += 1;
          }
          return (!chunk.highlight)
            ? text
            : (
              <RNText
                key={ index }
                { ...propsFor?.(text, count) }
                style={ highlightStyle instanceof Function ? highlightStyle(text, count) : highlightStyle }>
                {replacementFor?.(text, count) || text}
              </RNText>
            );
        })}
      </RNText>
    </Text>
  );
}
