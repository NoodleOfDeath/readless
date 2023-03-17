import React from 'react';

import {
  Box,
  ThemeProvider,
  styled,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Route, Routes } from 'react-router-dom';

import CookieConsent from '@/components/layout/CookieConsent';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/header/Header';
import { SessionContext } from '@/contexts';
import { ROUTES } from '@/pages';

const StyledAppContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: -10px;
`;

const StyledAppContent = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

function App() {
  const { theme } = React.useContext(SessionContext);

  return (
    <GoogleOAuthProvider clientId={ process.env.GOOGLE_CLIENT_ID as string }>
      <ThemeProvider theme={ theme }>
        <CssBaseline />
        <StyledAppContainer>
          <Header />
          <StyledAppContent>
            <Routes>
              {Object.entries(ROUTES).map(([route, element ]) => {
                return (
                  <Route
                    key={ route }
                    path={ route }
                    element={ element } />
                );
              })}
            </Routes>
          </StyledAppContent>
          <Footer />
          <CookieConsent />
        </StyledAppContainer>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
