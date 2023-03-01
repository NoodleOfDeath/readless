import { createTheme, PaletteMode } from "@mui/material";

export const loadTheme = (mode: PaletteMode = 'light') => {
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
        primary: "#fff",
      },
      background: {
        default: "#031925",
      },
    },
    typography: {
      fontFamily: "Fhwaseriesd2020minu30",
    },
  });
}
  
