import type React from "react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { ThemeProvider } from "@mui/material/styles"
import { CssBaseline, Box } from "@mui/material"
import { lightTheme } from "@/config/theme"
import type { Locale } from "@/models/i18n"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeContextProvider } from "@/contexts/ThemeContext"
import AppCacheProvider from "@/components/AppCacheProvider"
import SellerLayout from "@/components/seller/layout/seller-layout"

interface SellerRootLayoutProps {
  children: React.ReactNode
  params: { locale: Locale }
}

export default async function SellerRootLayout({ children, params: { locale } }: SellerRootLayoutProps) {
  const messages = await getMessages()
  const direction = locale === "ar" ? "rtl" : "ltr"

  return (
    <html lang={locale} dir={direction}>
      <body>
        <ThemeContextProvider>
          <AuthProvider>
            <NextIntlClientProvider messages={messages}>
              <AppCacheProvider direction={direction}>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />
                  <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
                    <SellerLayout>{children}</SellerLayout>
                  </Box>
                </ThemeProvider>
              </AppCacheProvider>
            </NextIntlClientProvider>
          </AuthProvider>
        </ThemeContextProvider>
      </body>
    </html>
  )
}
