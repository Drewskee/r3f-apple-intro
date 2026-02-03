"use client";

import { Provider } from "react-redux";
import { FC } from "react";
import { ThemeProvider } from "next-themes";
import { LayoutContextProvider } from "@/context/layout.context";
import { AppContextProvider } from "@/context/app.context";

export const Providers: FC<any> = ({ children, ...props }) => {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Provider store={{ getState: () => ({}), dispatch: () => undefined, subscribe: () => undefined } as any}>
                <LayoutContextProvider>
                    {/* <AppContextProvider> */}
                        {children}
                    {/* </AppContextProvider> */}
                </LayoutContextProvider>
            </Provider>
        </ThemeProvider>
    );
};
