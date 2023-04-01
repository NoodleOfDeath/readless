import React from 'react';

import { Paper, styled } from '@mui/material';

import { hexToFilter } from '@/core';

const StyledIcon = styled(Paper)(({ theme }) => ({
  background: 'transparent',
  filter: hexToFilter(theme.palette.primary.main),
}));

type Props = {
  big?: boolean;
  height?: number;
  small?: boolean;
  variant?: 'compact';
};

export default function Logo({ 
  big,
  small,
  height = big ? 60 : small ? 30 : 40,
  variant,
}: Props = {}) {
  const img = React.useMemo(() => variant === 'compact' ? '/logo-compact.svg' : '/logo.svg', [variant]);
  return (
    <StyledIcon elevation={ 0 }>
      <img src={ img } alt="logo" height={ height } />
    </StyledIcon>
  );
}
