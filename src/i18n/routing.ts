import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ir', 'en'],

  // Used when no locale matches - changed to avoid redirect loops
  defaultLocale: 'ir',

  // Always show locale prefix to avoid redirect loops
  localePrefix: 'always'
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing) 