import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: {
      main: "#023047",
    },
    secondary: {
      main: "#3335cc",
    },
    text: {
      primary: "#0F0014",
      secondary: "rgba(0, 0, 0, 0.54)", //'#969696',
    },
    background: {
      default: "#3335cc",
    },
  },
  typography: {
    h6: {
      fontSize: "1rem",
    },
    h5: {
      fontSize: "1.3rem",
      padding: "0.5rem 0",
    },
    h4: {
      fontSize: "1.8rem",
      padding: 0,
      margin: 0,
    },
  },
});

export default theme;
