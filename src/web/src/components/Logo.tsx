import React from 'react';

import { Paper, styled } from '@mui/material';

const StyledIcon = styled(Paper)(({ theme }) => ({
  background: 'transparent',
  filter:
    'invert(15%) sepia(45%) saturate(4372%) hue-rotate(347deg) brightness(91%) contrast(122%)',
}));

type Props = {
  height?: number;
};

export default function Logo({ height = 40 }: Props = {}) {
  return (
    <StyledIcon elevation={ 0 }>
      <img src="logo.svg" alt="logo" height={ height } />
    </StyledIcon>
  );
}
