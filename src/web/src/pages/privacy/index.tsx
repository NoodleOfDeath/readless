import React from 'react';

import ReactMarkdown from 'react-markdown';

import text from '~/documents/privacy';

export default function PrivacyPage() {
  return (
    <ReactMarkdown>
      {text}
    </ReactMarkdown>
  );
}
