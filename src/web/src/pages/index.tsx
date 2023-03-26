import React from 'react';

import { Stack, styled } from '@mui/material';

import Page from '@/components/layout/Page';
import { useRouter } from '@/next/router';

const StyledStack = styled(Stack)(() => ({
  alignContent: 'center',
  alignItems: 'center',
}));

export default function Index() {
  const router = useRouter();

  React.useEffect(() => {
    router.push('/search');
  }, [router]);

  return (
    <Page center title="theSkoop">
      <StyledStack spacing={ 2 }>
        Home
      </StyledStack>
    </Page>
  );
}
