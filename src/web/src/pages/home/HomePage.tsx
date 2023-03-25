import React from 'react';

import { Stack, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Page from '@/components/layout/Page';

const StyledStack = styled(Stack)(() => ({
  alignContent: 'center',
  alignItems: 'center',
}));

export default function HomePage() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/search');
  }, [navigate]);

  return (
    <Page center title="theSkoop">
      <StyledStack spacing={ 2 }>
        Home
      </StyledStack>
    </Page>
  );
}
