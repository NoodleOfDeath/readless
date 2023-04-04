import React from 'react';

import { Stack, styled } from '@mui/material';

import SearchBar from './SearchBar';

const StyledStack = styled(Stack)(() => ({
  alignItems: 'center',
  alignSelf: 'center',
  margin: 'auto',
  maxWidth: 1280,
  textAlign: 'center',
  width: '100%',
}));

// TODO: Add category filters
export default function Filters() {
  return (
    <StyledStack>
      <SearchBar />
    </StyledStack>
  );
}
