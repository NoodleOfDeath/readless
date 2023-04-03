import React from 'react';

import { Card, CardContent } from '@mui/material';

import Page from '~/components/layout/Page';
import { SessionContext } from '~/contexts';

export default function ProfilePage() {
  const { userData } = React.useContext(SessionContext);

  return (
    <Page left title="Profile">
      <Card>
        <CardContent>
          <h4>Profile</h4>
          User Id: 
          {' '}
          {String(userData?.userId)}
        </CardContent>
      </Card>
    </Page>
  );
}
