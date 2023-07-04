import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';

import { findAll } from 'highlight-words-core';

import { Text, TextProps } from '~/components';

export type HighlighterProps = Omit<TextProps, 'children'> & {
  children?: string;
  autoEscape?: boolean;
  highlightStyle?: TextStyle
  searchWords?: string[],
  sanitize?: () => string,
};

export function Highlighter({ 
  children: textToHighlight = '', 
  searchWords = [],
  ...props
}: HighlighterProps) {
  const chunks = findAll({
    searchWords, textToHighlight, ...props, 
  });
  return (
    <Text { ...props }>
      <RNText>
        {chunks.map((chunk, index) => {
          const text = textToHighlight?.slice(chunk.start, chunk.end);
          return (!chunk.highlight)
            ? text
            : (
              <RNText
                key={ index }
                style={ props.highlightStyle }>
                {text}
              </RNText>
            );
        })}
      </RNText>
    </Text>
  );
}
