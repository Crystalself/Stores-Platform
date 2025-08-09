// app/[locale]/layout.tsx
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { NextIntlClientProvider } from "next-intl";
import { lightTheme } from "@/config/theme";
import { Locale } from "@/models/i18n";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeContextProvider } from '@/contexts/ThemeContext';
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";

import AppCacheProvider from "@/components/AppCacheProvider";

export const metadata: Metadata = {
  title: "IUGaza Store",
  description: "Your one-stop shop for everything!",
  icons: {
    icon: "/nextjs-14-mui-i18n/public/image/logo/icon.ico"
  },
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  const messages = await getMessages();
  const direction = locale == "ar" ? "rtl" : "ltr";
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
                    {/* <Navbar /> */}
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
  );
}
