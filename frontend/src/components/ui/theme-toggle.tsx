"use client"

import { IconButton, Tooltip } from "@mui/material"
import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from "@mui/icons-material"
import { useTheme } from "./theme-provider"
import { useTranslations } from "next-intl"

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme()
  const t = useTranslations("common")

  return (
    <Tooltip title={isDarkMode ? t("lightMode") : t("darkMode")}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          background: "rgba(102, 126, 234, 0.1)",
          "&:hover": {
            background: "rgba(102, 126, 234, 0.2)",
            transform: "scale(1.1)",
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  )
}
