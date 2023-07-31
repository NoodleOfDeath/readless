import React from 'react';

import {
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ParallaxProvider } from 'react-scroll-parallax';
import '../styles/app.sass';

const theme = createTheme({ components: { MuiTypography: { defaultProps: { fontFamily: 'Anek Latin, Roboto, sans-serif' } } } });

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <ParallaxProvider>
        <Head>
          <title key='title'>Read Less – News without the noise</title>
          <meta name="description" content="Read Less is a news aggregator that uses AI to cut through the noise in the news headlines." />
          <meta
            key='og:title'
            property="og:title" 
            content="Read Less – News without the noise" />
          <meta
            key='og:description'
            property="og:description"
            content="Using AI to cut through the bullsh💩t" />
          <meta
            key='og:image'
            property="og:image"
            content="/sms-banner.png" />
          <meta
            key='og:url'
            property="og:url"
            content={ process.env.NEXT_PUBLIC_BASE_URL } />
          <meta
            key='og:site_name'
            property="og:site_name"
            content="Read Less – News without the noise" />
          <meta
            key='twitter:title'
            property="twitter:title" 
            content="Read Less – News without the noise" />
          <meta
            key='twitter:description'
            property="twitter:description"
            content="Using AI to cut through the bullsh💩t" />
          <meta
            key='twitter:image'
            property="twitter:image"
            content="/twitter-card.png" />
          <meta 
            key='og:type'
            property="og:type"
            content="Article" />
          <meta
            key='twitter:card'
            content="summary" 
            name="twitter:card" />
          <meta
            key='twitter:site'
            name="twitter:site"
            content="@readlessai" />
          <meta
            key='twitter:creator'
            name="twitter:creator"
            content="@readlessai" />
          <meta
            key='fb:app_id'
            property="fb:app_id" 
            content={ process.env.NEXT_PUBLIC_FACEBOOK_ID } />
          <meta
            key='robots'
            name="robots" 
            content="index, follow" />
          <meta
            key="apple-itunes-app" 
            name="apple-itunes-app"
            content={ `app-id=${process.env.NEXT_PUBLIC_APPLE_APP_ID}` } />
          <meta
            key='viewport'
            name="viewport"
            content="width=device-width, initial-scale=1" />
          <meta 
            key='msapplication-TileImage'
            name="msapplication-TileColor"
            content="#da532c" />
          <meta 
            key='theme-color'
            name="theme-color"
            content="#ffffff" />
        </Head>
        <Component { ...pageProps } />
      </ParallaxProvider>
    </ThemeProvider>
  );
}

export default App;
