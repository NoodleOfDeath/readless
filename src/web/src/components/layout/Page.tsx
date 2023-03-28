import React from 'react';

import { styled } from '@mui/material';

type Props = React.PropsWithChildren<{
  title?: string;
  left?: boolean;
  right?: boolean;
  center?: boolean;
  align?: 'left' | 'right' | 'center';
}>;

// eslint-disable-next-line react/display-name
const StyledContainer = styled('div')<Props>(({
  theme,
  left,
  right,
  center,
  align = left ? 'left' : right ? 'right' : center ? 'center' : 'left',
}) => ({
  alignItems: align,
  alignSelf: align,
  justifyContent: align,
  margin: 'auto',
  maxWidth: 1280,
  padding: theme.spacing(4),
  textAlign: align,
  width: 'inherit',
}));

export default function Page({
  children, title, ...other 
}: Props) {
  return (
    <StyledContainer { ...other }>
      {children}
    </StyledContainer>
  );
}
