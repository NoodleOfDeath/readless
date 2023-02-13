import React from "react";
import Header from "./components/Header";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { routes } from "@/pages";
import styled from "styled-components";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: -10px;
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <BrowserRouter>
          <Header />
          <AppContent>
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
          </AppContent>
        </BrowserRouter>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
