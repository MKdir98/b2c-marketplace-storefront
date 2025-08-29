import { NextRequest } from "next/server"
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Create and export the next-intl middleware directly
export default createMiddleware(routing)

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // Skip all API routes
    // Skip all static files
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
