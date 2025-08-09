// components/layout/WelcomeHeader.tsx

"use client";
import React from "react";

export default function WelcomeHeader({ categories, locale }: { categories: any[]; locale: string }) {
  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b shadow-sm py-4 px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">My Shop</h1>
        <nav>
          <ul className="flex gap-4 text-sm">
            {categories.map((cat) => (
              <li key={cat.id}>
                {locale === "ar" ? cat.name_ar : cat.name_en}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
