"use client"
import { useState } from "react"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { SearchIcon, CartIcon } from "@/icons"

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <>
      {/* Top Promotional Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 px-4 text-sm font-medium">
        <div className="max-w-screen-2xl mx-auto flex flex-wrap items-center justify-center gap-2 md:gap-6">
          <span className="font-semibold">🔥 تخفیف ویژه محصولات دست‌ساز</span>
          <LocalizedClientLink href="/collections/sale" className="underline hover:no-underline transition-all">
            خرید با تخفیف
          </LocalizedClientLink>
          <span className="hidden md:inline">ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان</span>
          <LocalizedClientLink href="/shipping" className="underline hover:no-underline transition-all">
            اطلاعات بیشتر
          </LocalizedClientLink>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto">
          
          {/* Header Row */}
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            
            {/* Left: Brand Name */}
            <div className="flex-1">
              <LocalizedClientLink href="/" className="flex items-center group">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 group-hover:text-purple-600 transition-colors">
                  innjaa
                </h1>
                <span className="text-xs text-gray-500 mr-2 hidden sm:block">محصولات دست‌ساز و مد</span>
              </LocalizedClientLink>
            </div>

            {/* Center: Search */}
            <div className="flex-1 flex justify-center max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی محصولات..."
                  className="w-full pr-10 pl-4 py-3 bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm text-right"
                />
              </form>
            </div>

            {/* Right: Cart */}
            <div className="flex-1 flex items-center justify-end">
              <LocalizedClientLink 
                href="/cart" 
                className="relative text-gray-700 hover:text-purple-600 transition-colors p-3 rounded-full hover:bg-gray-50"
              >
                <CartIcon className="h-6 w-6" />
                <span className="absolute -top-1 -left-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  0
                </span>
                <span className="sr-only">سبد خرید</span>
              </LocalizedClientLink>
            </div>
          </div>

          {/* Simple Navigation */}
          <nav className="border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-center space-x-8 px-4 lg:px-8 h-12">
              <LocalizedClientLink 
                href="/products" 
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors py-2"
              >
                همه محصولات
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/categories/handmade" 
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors py-2"
              >
                دست‌ساز
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/categories/fashion" 
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors py-2"
              >
                مد و پوشاک
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/categories/accessories" 
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors py-2"
              >
                اکسسوری
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/about" 
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors py-2"
              >
                درباره ما
              </LocalizedClientLink>
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
