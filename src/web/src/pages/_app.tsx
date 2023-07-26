import React from 'react';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ParallaxProvider } from 'react-scroll-parallax';
import '../styles/app.sass';

function App({ Component, pageProps }: AppProps) {
  return (
    <ParallaxProvider>
      <Head>
        <title>Read Less – News without the noise</title>
        <meta name="description" content="Read Less is a news aggregator that uses AI to cut through the noise in the news headlines." />
        <meta
          content="Read Less – News without the noise"
          property="og:title" />
        <meta
          content="Using AI to cut through the bullsh💩t"
          property="og:description" />
        <meta
          content="/sms-banner.png"
          property="og:image" />
        <meta
          property="og:url"
          content={ process.env.NEXT_PUBLIC_BASE_URL } />
        <meta
          property="og:site_name"
          content="Read Less – News without the noise" />
        <meta
          content="Read Less – News without the noise"
          property="twitter:title" />
        <meta
          content="Using AI to cut through the bullsh💩t"
          property="twitter:description" />
        <meta
          content="/twitter-card.png"
          property="twitter:image" />
        <meta property="og:type" content="Article" />
        <meta content="summary" name="twitter:card" />
        <meta name="twitter:site" content="@readlessai" />
        <meta name="twitter:creator" content="@readlessai" />
        <meta property="fb:app_id" content={ process.env.NEXT_PUBLIC_FACEBOOK_ID } />
        <meta name="robots" content="index, follow" />
        <meta key="apple-itunes-app" name="apple-itunes-app" content={ `app-id=${process.env.NEXT_PUBLIC_APPLE_APP_ID}` } />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Component { ...pageProps } />
    </ParallaxProvider>
  );
}

export default App;
