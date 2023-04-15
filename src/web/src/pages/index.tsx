import React from 'react';

import { Stack } from '@mui/material';

import JustNewsHeader from '~/components/layout/JustNewsHeader';
import Page from '~/components/layout/Page';

export default function HomePage() {
  return (
    <Page center title="Read &lt; Less">
      <Stack>
        <JustNewsHeader />
      </Stack>
    </Page>
  );
}
