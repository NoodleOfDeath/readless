import React from 'react';

import { Box, styled } from '@mui/material';
import PropTypes from 'prop-types';

import CookieConsent from '~/components/layout/CookieConsent';
import Header from '~/components/layout/header/Header';
import { SessionContextProvider, ThemeContextProvider } from '~/contexts';

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
      <SessionContextProvider>
        <ThemeContextProvider>
          <StyledAppContainer>
            <Header />
            <StyledAppContent>
              <Component { ...pageProps } />
            </StyledAppContent>
            <CookieConsent />
          </StyledAppContainer>
        </ThemeContextProvider>
      </SessionContextProvider>
    </React.Fragment>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;