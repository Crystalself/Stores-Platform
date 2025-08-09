// app/[locale]/customer/layout.tsx
import React from "react"
import type { Metadata } from "next"
import { getMessages } from "next-intl/server"
import { NextIntlClientProvider } from "next-intl"
import { Locale } from "@/models/i18n"
import { ThemeContextProvider } from "@/contexts/ThemeContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import AppCacheProvider from "@/components/AppCacheProvider"
import { ThemeProvider } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import { lightTheme } from "@/config/theme"
import { Roboto } from "next/font/google"
import CustomerNavbar from "@/components/layout/Navbar" // 👈 تأكد من المسار الصحيح
import CartDrawer from "@/components/cart/CartDrawer"

export const metadata: Metadata = {
  title: "Customer - IUGaza Store",
  description: "Your one-stop shop for customers!",
}

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
})

export default async function CustomerLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode
  params: { locale: Locale }
}>) {
  const messages = await getMessages()
  const direction = locale === "ar" ? "rtl" : "ltr"

  return (
    <html lang={locale} dir={direction}>
      <body className={`${roboto.variable}`}>
        <ThemeContextProvider>
          <AuthProvider>
            <CartProvider>
              <NextIntlClientProvider messages={messages}>
                <AppCacheProvider direction={direction}>
                  <ThemeProvider theme={lightTheme}>
                    <CssBaseline />
                    <CustomerNavbar /> {/* 👈 Navbar ثابت */}
                    {children}
                    <CartDrawer />
                  </ThemeProvider>
                </AppCacheProvider>
              </NextIntlClientProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeContextProvider>
      </body>
    </html>
  )
}
