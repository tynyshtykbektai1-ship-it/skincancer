import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Medical AI Diagnosis | Медициналық AI Диагностикасы",
  description: "AI-powered medical skin analysis and diagnosis system",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/justicon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/justicon.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/justicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="kk">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
