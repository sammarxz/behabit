import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import Script from "next/script"
import { Providers } from "./providers"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://behabit.marxz.me"),
  title: "BeHabit - Habit Tracker",
  description: "Track your daily habits with a beautiful GitHub-inspired heatmap dashboard",
  authors: [{ name: "Sam Marxz" }],
  applicationName: "BeHabit",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "BeHabit",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "BeHabit - Habit Tracker",
    description: "Track your daily habits with a beautiful GitHub-inspired heatmap dashboard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BeHabit Dashboard Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeHabit - Habit Tracker",
    description: "Track your daily habits with a beautiful GitHub-inspired heatmap dashboard",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} dark`}>
        <Providers>
          {children}
          <Toaster theme="dark" position="bottom-right" />
        </Providers>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="a2680e50-55dc-40e5-8490-204989329c5f"
        />
      </body>
    </html>
  )
}
