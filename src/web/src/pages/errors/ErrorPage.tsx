import React from 'react';

import { Stack, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import Page from '@/components/layout/Page';

export default function ErrorPage() {
  const [searchParams] = useSearchParams();
  const rawError = searchParams.get('error');
  const error = React.useMemo(() => {
    try {
      return JSON.parse(rawError || '');
    } catch (e) {
      return undefined;
    }
  }, [rawError]);
  return (
    <Page title="Uh oh...">
      <Stack spacing={ 2 }>
        <Typography>Oopsies. We messed up!</Typography>
        {error && (
          <pre>
            {JSON.stringify(error, null, 2)}
          </pre>
        )}
      </Stack>
    </Page>
  );
}