import React from 'react';

import { styled } from '@mui/material';
import Head from 'next/head';

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
      <Head>
        <title key="title">{title ?? 'Read Less'}</title> 
        <meta key="charset" charSet="utf-8" />
        <meta key="og:title" property="og:title" content="Read Less" />
        <meta key="og:image" property="og:image" content="/sms-banner.png" />
        <meta key="apple-itunes-app" name="apple-itunes-app" content={ `app-id=${process.env.NEXT_PUBLIC_APPLE_APP_ID}` } />
        <meta key="viewport" name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      {children}
    </StyledContainer>
  );
}
