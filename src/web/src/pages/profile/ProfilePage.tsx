import React from 'react';

import ReactMarkdown from 'react-markdown';

import Page from '@/components/layout/Page';
import { SessionContext } from '@/contexts';

export default function ProfilePage() {
  const { userData } = React.useContext(SessionContext);

  return (
    <Page left title="Profile">
      <ReactMarkdown>{String(userData?.userId)}</ReactMarkdown>
    </Page>
  );
}
