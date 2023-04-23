import React from 'react';

import { styled } from '@mui/material';

import { hexToFilter } from '~/utils';

const StyledIcon = styled('div')(({ theme }) => ({
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
  const src = React.useMemo(() => variant === 'compact' ? '/logo-compact.svg' : '/logo.svg', [variant]);
  return (
    <StyledIcon>
      <img src={ src } alt="logo" height={ height } />
    </StyledIcon>
  );
}
