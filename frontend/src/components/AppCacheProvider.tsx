"use client";

import rtlPlugin from "stylis-plugin-rtl";
import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Direction } from "@mui/material";

export default function AppCacheProvider({
  children,
  direction,
}: {
  children: ReactNode;
  direction: Direction;
}) {
  const stylisPlugins = direction == "rtl" ? [rtlPlugin] : [];

  return (
    <AppRouterCacheProvider
      options={{
        key: "muirtl",
        stylisPlugins,
      }}
    >
      {children}
    </AppRouterCacheProvider>
  );
}
