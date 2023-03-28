import React from 'react';

import ReactMarkdown from 'react-markdown';

import Page from '@/components/layout/Page';
import text from '@/documents/about';

export default function AboutPage() {
  return (
    <Page title="About">
      <ReactMarkdown>
        {text}
      </ReactMarkdown>
    </Page>
  );
}
