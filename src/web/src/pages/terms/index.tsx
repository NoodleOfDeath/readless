import React from 'react';

import ReactMarkdown from 'react-markdown';

import Page from '@/components/layout/Page';
import text from '@/documents/terms';

export default function TermsPage() {
  return (
    <Page left title="Terms of Service">
      <ReactMarkdown>
        {text}
      </ReactMarkdown>
    </Page>
  );
}
