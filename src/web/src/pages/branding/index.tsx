import React from 'react';

import { Stack } from '@mui/material';

import Layout from '~/components/Layout';

export default function BrandingPage() {
  return (
    <Layout>
      <Stack spacing={ 1 }>
        <img src="/images/logo.svg" />
        <img src="/images/logo-compact.svg" />
      </Stack>
    </Layout>
  );
}