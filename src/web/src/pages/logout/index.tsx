import React from 'react';

import Page from '~/components/layout/Page';
import { useLoginClient } from '~/hooks';

export default function ContemplatingPage() {
  const { logOut } = useLoginClient();
  React.useEffect(() => {
    logOut();
  }, [logOut]);
  return (
    <Page title='Carefully mulling over your web request...'>
      I am deciding if I should destroy the world or not...
    </Page>
  );
}