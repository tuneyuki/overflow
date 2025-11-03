import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Providers } from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "業務後Overflow",
  description: "Answer. Inspire. Evolve.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Providers>
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </Providers>

      </body>
    </html>
  )
}
