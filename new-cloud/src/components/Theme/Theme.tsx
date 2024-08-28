import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
        },
        title: {
          fontSize: "1.25rem",
          fontWeight: 500,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
  },
});

export default theme;
