import React from 'react';

import {
  Box,
  Button,
  Card,
  CardMedia,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Head from 'next/head';
import PropTypes from 'prop-types';

import CookieConsent from '~/components/layout/CookieConsent';
import Header from '~/components/layout/header/Header';
import { AppStateContextProvider, SessionContextProvider } from '~/contexts';

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

const StyledDownloadBanner = styled(Card)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const StyledStack = styled(Stack)(() => ({ alignItems: 'center' }));

const StyledCardMedia = styled(CardMedia)(() => ({
  borderRadius: '22%',
  height: 40,
  overflow: 'hidden',
  width: 40,
}));

function App(props: PropTypes.InferProps<typeof App.propTypes>) {
  const { Component, pageProps } = props;
  
  const [downloadMobileApp, setDownloadMobileApp] = React.useState('');
  
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
    const ios = [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
    if (ios) {
      setDownloadMobileApp('ios');
    }
  }, []);
  
  return (
    <React.Fragment>
      <Head>
        <title>Read &lt; Less</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <GoogleOAuthProvider clientId={ process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string }>
        <SessionContextProvider>
          <AppStateContextProvider>
            <StyledAppContainer>
              {downloadMobileApp && (
                <StyledDownloadBanner>
                  <StyledStack direction="row" spacing={ 2 }>
                    <StyledCardMedia
                      onClick={ () => window.open(`/${downloadMobileApp}`, '_blank') }
                      image="/AppIcon.png" />
                    <Typography variant="caption">
                      Read anywhere and offline in the app
                    </Typography>
                    <Button
                      variant='outlined'
                      onClick={ () => window.open(`/${downloadMobileApp}`, '_blank') }>
                      <Typography variant="caption">Read In App</Typography>
                    </Button>
                  </StyledStack>
                </StyledDownloadBanner>
              )}
              <Header />
              <StyledAppContent>
                <Component { ...pageProps } />
              </StyledAppContent>
              <CookieConsent />
            </StyledAppContainer>
          </AppStateContextProvider>
        </SessionContextProvider>
      </GoogleOAuthProvider>
    </React.Fragment>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;