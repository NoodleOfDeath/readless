import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import styled from "styled-components";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import BaseContextProvider, {
  DEFAULT_BASE_CONTEXT,
} from "@/contexts/BaseContext";
import { routes } from "@/pages";
import { theme } from "@/theme";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const StyledAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: -10px;
`;

const StyledAppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BaseContextProvider>
        <StyledAppContainer>
          <BrowserRouter>
            <Header />
            <StyledAppContent>
              <Routes>
                {routes.map((route) => {
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  );
                })}
              </Routes>
            </StyledAppContent>
            <Footer />
          </BrowserRouter>
        </StyledAppContainer>
      </BaseContextProvider>
    </ThemeProvider>
  );
}

export default App;
