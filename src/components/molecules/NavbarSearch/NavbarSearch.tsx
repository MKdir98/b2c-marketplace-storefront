"use client"

import { Input } from "@/components/atoms"
import { SearchIcon } from "@/icons"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'

// Helper function to get translations with fallback
const useTranslationsWithFallback = () => {
  try {
    const t = useTranslations('common')
    return {
      searchProduct: t('searchProduct')
    }
  } catch (error) {
    // Check if we're in Persian environment based on document direction
    const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl'
    if (isRTL) {
      return {
        searchProduct: 'جستجوی محصول'
      }
    }
    return {
      searchProduct: 'Search product'
    }
  }
}

export const NavbarSearch = () => {
  const searchParams = useSearchParams()
  const translations = useTranslationsWithFallback()
  const router = useRouter()

  const [search, setSearch] = useState(searchParams.get("query") || "")

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (search) {
      router.push(`/categories?query=${search}`)
    } else {
      router.push(`/categories`)
    }
  }

  return (
    <form className="flex items-center" method="POST" onSubmit={submitHandler}>
      <Input
        icon={<SearchIcon />}
        placeholder={translations.searchProduct}
        value={search}
        changeValue={setSearch}
      />
      <input type="submit" className="hidden" />
    </form>
  )
}
