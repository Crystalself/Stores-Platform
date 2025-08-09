// components/providers/LocaleProvider.tsx

"use client";
import { ReactNode } from "react";

export function LocaleProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  // في المستقبل: يمكن إضافة next-intl أو i18next هنا
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>{children}</body>
    </html>
  );
}
