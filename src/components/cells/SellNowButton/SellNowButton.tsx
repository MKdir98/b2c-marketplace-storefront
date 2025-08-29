"use client"

import { Button } from "@/components/atoms"
import { ArrowRightIcon } from "@/icons"
import Link from "next/link"
import { useTranslations } from 'next-intl'

// Helper function to get translations with fallback
const useTranslationsWithFallback = () => {
  try {
    const t = useTranslations('common')
    return {
      sellNow: t('sellNow')
    }
  } catch (error) {
    // Check if we're in Persian environment based on document direction
    const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl'
    if (isRTL) {
      return {
        sellNow: 'فروش کنید'
      }
    }
    return {
      sellNow: 'Sell now'
    }
  }
}

export const SellNowButton = () => {
  const translations = useTranslationsWithFallback()

  return (
    <Link
      href={
        process.env.NEXT_PUBLIC_ALGOLIA_ID === "UO3C5Y8NHX"
          ? "https://vendor-sandbox.vercel.app/"
          : "https://vendor.mercurjs.com"
      }
    >
      <Button className="group uppercase !font-bold pl-12 gap-1 flex items-center">
        {translations.sellNow}
        <ArrowRightIcon
          color="white"
          className="w-5 h-5 group-hover:opacity-100 opacity-0 transition-all duration-300"
        />
      </Button>
    </Link>
  )
}
