import React from 'react';

import ReactMarkdown from 'react-markdown';

import Page from '@/components/layout/Page';
import text from '@/documents/privacy';

export default function PrivacyPage() {
  return (
    <Page left title="Privacy Policy">
      <ReactMarkdown>
        {text}
      </ReactMarkdown>
    </Page>
  );
}
