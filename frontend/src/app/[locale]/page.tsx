// src/app/[locale]/page.tsx
"use client"

import React from "react"

interface PageProps {
  params: {
    locale: string
  }
}

export default function WlecomPage({ params }: PageProps) {
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>Welcom Page</h1>
      <p>Current locale: {params.locale}</p>
    </div>
  )
}
