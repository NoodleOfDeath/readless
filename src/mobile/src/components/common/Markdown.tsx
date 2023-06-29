import React from 'react';

import {
  ChildlessViewProps,
  Highlighter,
  HighlighterProps,
} from '~/components';

export const MarkdownSearchPattern = { default: /\*\*(.*?)\*\*/g };

export type MarkdownProps = Omit<ChildlessViewProps & HighlighterProps, 'searchWords'> & {
  searchPattern?: string | RegExp;
};

export function Markdown({
  children,
  searchPattern = MarkdownSearchPattern.default,
  ...props
}: MarkdownProps) {

  const [words, setWords] = React.useState<string[]>([]);

  const parsedChildren = React.useMemo(() => {
    return children?.replace(searchPattern, (_, word) => word);
  }, [children, searchPattern]);

  React.useEffect(() => {
    const boldWords: string[] = [];
    const matches = children?.matchAll(searchPattern);
    if (!matches) {
      return;
    }
    for (const match of Array.from(matches)) {
      boldWords.push(match[1]);
    }
    setWords(boldWords);
  }, [children, searchPattern]);

  return (
    <Highlighter
      { ...props }
      highlightStyle={ props.highlightStyle ?? { fontWeight: 'bold' } }
      searchWords={ words }>
      {parsedChildren}
    </Highlighter>
  );
}