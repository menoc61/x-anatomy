import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"

import "./globals.css"
import ClientLayout from "./client-layout"
import ServiceWorkerRegistration from "./sw-register"

// 🔥 Load Inter locally (Turbopack-safe)
const inter = localFont({
  src: [
    { path: "./fonts/Inter-Regular.woff2", weight: "400" },
    { path: "./fonts/Inter-Bold.woff2", weight: "700" },
  ],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Anatomy Explorer SaaS",
  description: "Interactive 3D human anatomy explorer with subscription plans",
  generator: "v0.dev",
  icons: {
    icon: "/placeholder-logo.svg",
    apple: "/placeholder-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ServiceWorkerRegistration />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
