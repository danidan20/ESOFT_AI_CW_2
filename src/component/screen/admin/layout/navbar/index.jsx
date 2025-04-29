import React, { useContext } from 'react';
import {
    Box,
    IconButton,
    useTheme,
} from "@mui/material";
import { tokens, ColorModeContext } from "../../../../../theme/theme";
import {
    DarkModeOutlined,
    LightModeOutlined,
} from "@mui/icons-material";

const Navbar = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            p={2}
        >
            <Box>
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <LightModeOutlined sx={{ fontSize: "25px" }} />
                    ) : (
                        <DarkModeOutlined sx={{ fontSize: "25px" }} />
                    )}
                </IconButton>
            </Box>
        </Box>
    );
};

export default Navbar;
