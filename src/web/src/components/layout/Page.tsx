import React from 'react';

import { styled } from '@mui/material';
import Head from 'next/head';

type Props = React.PropsWithChildren<{
  title?: string;
  left?: boolean;
  right?: boolean;
  center?: boolean;
  align?: 'left' | 'right' | 'center';
  headTags?: React.ReactNode[];
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
  // eslint-disable-next-line react/jsx-key
  children, title, headTags = [<title>{title}</title>], ...other 
}: Props) {
  return (
    <StyledContainer { ...other }>
      <Head>
        {headTags.map((tag, i) => (<React.Fragment key={ i }>{tag}</React.Fragment>))}
      </Head>
      {children}
    </StyledContainer>
  );
}
