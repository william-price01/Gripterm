import React from "react";
import Dashboard from "./layout/Dashboard";
import { ResponseProvider } from "./contexts/ResponseContext";
import { ThemeProvider } from "@mui/material";
import theme from "./components/Theme/Theme";
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ResponseProvider>
        <div className="App" style={{ height: "100vh", width: "100vw" }}>
          <Dashboard />
        </div>
      </ResponseProvider>
    </ThemeProvider>
  );
};
export default App;
