import React from 'react';

import type { AppProps } from 'next/app';
import { ParallaxProvider } from 'react-scroll-parallax';
import '../styles/app.sass';

function App({ Component, pageProps }: AppProps) {
  return (
    <ParallaxProvider>
      <Component { ...pageProps } />
    </ParallaxProvider>
  );
}

export default App;
