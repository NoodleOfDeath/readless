import React from 'react';
import { Text as RNText } from 'react-native';

export type Chunk = {
  start: number;
  end: number;
  highlight: boolean;
};

import {
  ChildlessViewProps,
  Text,
  TextProps,
  View,
} from '~/components';

export type Token = {
  pattern: RegExp;
  style?: TextProps['style'];
  render?: (matches?: RegExpExecArray) => React.ReactNode;
};

export const TOKENS: { [key: string]: Token } = {
  bold: {
    pattern: /\*\*(.*?)\*\*/g,
    render: (matches) => {
      return (
        <RNText
          key={ matches?.index }
          style={ { fontWeight: 'bold' } }>
          {matches?.[1]}
        </RNText>
      );
    },
    style: { fontWeight: 'bold' },
  },
  code: {
    pattern: /`(.*?)`/g,
    style: { fontFamily: 'monospace' },
  },
  italic: {
    pattern: /\*(.*?)\*/g,
    style: { fontStyle: 'italic' },
  },
  strikethrough: {
    pattern: /~~(.*?)~~/g,
    style: { textDecorationLine: 'line-through' },
  },
  underline: {
    pattern: /__(.*?)__/g,
    style: { textDecorationLine: 'underline' },
  },
};

export type MarkdownProps = Omit<ChildlessViewProps & TextProps, 'children'> & {
  children?: string;
};

export function Markdown({ children, ...props }: MarkdownProps) {
  const sections = React.useMemo(() => {
    return children?.split('\n\n') ?? [];
  }, [children]);
  return (
    <View { ...props } gap={ 12 }>
      {sections.map((s) => {
        return (
          <Text key={ s }>{s}</Text>
        );
      })}
    </View>
  ); 
}
