import React from 'react';

import ReactMarkdown from 'react-markdown';

import Layout from '~/components/Layout';
import text from '~/documents/privacy';

export default function PrivacyPage() {

  return (
    <Layout>
      <ReactMarkdown>
        {text}
      </ReactMarkdown>
    </Layout>
  );
}
