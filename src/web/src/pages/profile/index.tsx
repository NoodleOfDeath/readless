import React from 'react';

import { Card, CardContent } from '@mui/material';

import Page from '~/components/layout/Page';
import { SessionContext } from '~/contexts';

export default function ProfilePage() {
  const { userData } = React.useContext(SessionContext);
  React.useEffect(() => {
    if (!userData) {
      window.location.href = '/login';
    }
  }, [userData]);
  return (
    <Page left title="Profile">
      <Card>
        <CardContent>
          <h4>Profile</h4>
          Coming soon!
        </CardContent>
      </Card>
    </Page>
  );
}
