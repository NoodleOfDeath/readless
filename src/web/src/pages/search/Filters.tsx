import React from 'react';

import { Stack, styled } from '@mui/material';

import SearchBar from '@/pages/search/SearchBar';

const StyledStack = styled(Stack)(() => ({
  width: '100%',
  maxWidth: 1280,
  margin: 'auto',
  alignSelf: 'center',
  alignItems: 'center',
  textAlign: 'center',
}));

export default function Filters() {
  return (
    <StyledStack>
      <SearchBar />
    </StyledStack>
  );
}
