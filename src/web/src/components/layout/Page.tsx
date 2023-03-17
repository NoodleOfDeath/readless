import React from 'react';

import {
  Container,
  ContainerProps,
  styled,
} from '@mui/material';

type Props = Omit<ContainerProps, 'left' | 'right' | 'center' | 'align'> & {
  title?: string;
  left?: boolean;
  right?: boolean;
  center?: boolean;
  align?: 'left' | 'right' | 'center';
};

// eslint-disable-next-line react/display-name
const StyledContainer = styled(
  ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    left, right, center, align, ...props 
  }: ContainerProps & Props) => (
    <Container { ...props } maxWidth={ false } />
  ),
)(
  ({
    theme,
    left,
    right,
    center,
    align = left ? 'left' : right ? 'right' : center ? 'center' : 'left',
  }) => ({
    alignItems: align,
    alignSelf: align,
    justifyContent: align,
    marginTop: theme.spacing(5),
    maxWidth: 1280,
    textAlign: align,
  }),
);

export default function Page({
  children, title, ...other 
}: Props) {
  React.useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
  return (
    <StyledContainer { ...other }>
      {children}
    </StyledContainer>
  );
}
