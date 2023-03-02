import { createTheme, PaletteMode } from "@mui/material";

export const loadTheme = (mode: PaletteMode = "light") => {
  const lightMode = mode === "light";
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#3f51b5",
      },
      secondary: {
        main: "#002984",
      },
      text: {
        primary: lightMode ? "#000" : "#fff",
      },
      background: {
        default: lightMode ? "#eee" : "#031925",
      },
    },
    typography: {
      fontFamily: "Fhwaseriesd2020minu30",
      allVariants: {
        wordSpacing: "-0.4rem",
      },
      h1: {
        wordSpacing: "-0.7rem",
      },
      h2: {
        wordSpacing: "-0.7rem",
      },
      h3: {
        wordSpacing: "-0.7rem",
      },
      h4: {
        wordSpacing: "-0.7rem",
      },
      h5: {
        wordSpacing: "-0.7rem",
      },
      h6: {
        wordSpacing: "-0.7rem",
      },
    },
  });
};
