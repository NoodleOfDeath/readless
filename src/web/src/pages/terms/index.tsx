import React from 'react';

import ReactMarkdown from 'react-markdown';

import text from '~/documents/terms';

export default function TermsPage() {
  return (
    <ReactMarkdown>
      {text}
    </ReactMarkdown>
  );
}
