import React from 'react';

import { Box, styled } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Head from 'next/head';
import PropTypes from 'prop-types';

import CookieConsent from '@/components/layout/CookieConsent';
import Header from '@/components/layout/header/Header';
import { SessionContextProvider } from '@/contexts';

const StyledAppContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const StyledAppContent = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

function App(props: PropTypes.InferProps<typeof App.propTypes>) {
  const { Component, pageProps } = props;
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);
  return (
    <React.Fragment>
      <Head>
        <title>ReadLess</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <SessionContextProvider>
        <GoogleOAuthProvider clientId={ process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string }>
          <StyledAppContainer>
            <Header />
            <StyledAppContent>
              <Component { ...pageProps } />
            </StyledAppContent>
            <CookieConsent />
          </StyledAppContainer>
        </GoogleOAuthProvider>
      </SessionContextProvider>
    </React.Fragment>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;