import type { Metadata } from "next"
import { Funnel_Display, Vazirmatn } from "next/font/google"
import "./globals.css"
import { Toaster } from "@medusajs/ui"
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: {
    template: `%s | ${
      process.env.NEXT_PUBLIC_SITE_NAME ||
      "Mercur B2C Demo - Marketplace Storefront"
    }`,
    default:
      process.env.NEXT_PUBLIC_SITE_NAME ||
      "Mercur B2C Demo - Marketplace Storefront",
  },
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Mercur B2C Demo - Marketplace Storefront",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get current locale from next-intl
  const locale = await getLocale()
  
  // RTL languages
  const isRTL = locale === 'ir'
  
  // Get messages for the current locale
  const messages = await getMessages()

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className="">
      <body
        className={`${vazirmatn.className} antialiased bg-primary text-secondary relative`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster position="top-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
