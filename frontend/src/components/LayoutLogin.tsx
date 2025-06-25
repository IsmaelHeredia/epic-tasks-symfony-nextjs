import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import "@/styles/global.css";
import CssBaseline from "@mui/material/CssBaseline";
import Tooltip from "@mui/material/Tooltip";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomIconButton from "@/components/CustomIconButton";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { ThunkDispatch } from "@reduxjs/toolkit";

import { changeMode, selectTheme } from "@/store/reducers/themesSlice";

export default function LayoutLogin({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    const mode = useSelector((state: RootState) => state.themes.mode); 
    const theme = useSelector(selectTheme);

    return (
        <>
            <AppRouterCacheProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                    <div className="botones-theme">
                        <Tooltip title="Modo claro/oscuro">
                            <CustomIconButton onClick={() =>
                                dispatch(changeMode({ mode: mode === "light" ? "dark" : "light" }))
                            }>
                                {mode === "light" ? <DarkModeIcon /> : <WbSunnyIcon />}
                            </CustomIconButton>

                        </Tooltip>
                    </div>
                    <div>
                        <ToastContainer
                            position="bottom-center"
                            autoClose={2000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme={mode === "light" ? "light" : "dark"}
                        />
                    </div>
                </ThemeProvider>
            </AppRouterCacheProvider>
        </>
    );
}