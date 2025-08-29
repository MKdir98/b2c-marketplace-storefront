"use client"

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/atoms'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ir', name: 'فارسی', flag: '🇮🇷' }
]

export const LanguageSwitcher = () => {
  const router = useRouter()
  const pathname = usePathname()

  const getCurrentLocale = () => {
    const segments = pathname.split('/')
    return segments[1] || 'ir'
  }

  const changeLanguage = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    router.push(newPath)
  }

  const currentLocale = getCurrentLocale()
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[1]

  return (
    <div className="relative">
      <Button
        variant="tonal"
        className="flex items-center gap-2 text-sm"
        onClick={() => {
          const otherLang = languages.find(lang => lang.code !== currentLocale)
          if (otherLang) {
            changeLanguage(otherLang.code)
          }
        }}
      >
        <span>{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
      </Button>
    </div>
  )
} 