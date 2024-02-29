import React from 'react';

import ReactMarkdown from 'react-markdown';

import Layout from '~/components/Layout';
import text from '~/documents/terms';

export default function TermsPage() {
  return (
    <Layout>
      <ReactMarkdown>
        {text}
      </ReactMarkdown>
    </Layout>
  );
}
