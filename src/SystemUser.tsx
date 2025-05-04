import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { Navbar, SideBar } from "./component/screen/admin/layout/";
import { Outlet } from "react-router-dom";
import { createContext, useState, Dispatch, SetStateAction } from "react";
import { Theme } from "@mui/material/styles"; // Import the Theme type
import { useMode } from "./theme/theme"; // Import the useMode hook

interface ToggledContextValue {
  toggled: boolean;
  setToggled: Dispatch<SetStateAction<boolean>>;
}

interface ColorMode {
  toggleColorMode: () => void;
}

export const ToggledContext = createContext<ToggledContextValue | null>(null);
export const ColorModeContext = createContext<ColorMode>({ toggleColorMode: () => {} }); // Ensure context has the correct type

function SystemUser() {
  const modeAndColor = useMode();
  const theme = modeAndColor[0] as Theme;
  const colorMode = modeAndColor[1] as ColorMode;
  const [toggled, setToggled] = useState(false);
  const values: ToggledContextValue = { toggled, setToggled };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
            <SideBar />
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                maxWidth: "100%",
              }}
            >
              <Navbar />
              <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                <Outlet />
              </Box>
            </Box>
          </Box>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default SystemUser;