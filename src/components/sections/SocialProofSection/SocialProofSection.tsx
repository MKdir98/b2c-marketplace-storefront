"use client"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { useTranslations } from "next-intl"

export const SocialProofSection = () => {
  const t = useTranslations("home.rothys")

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Seen on TikTok Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">در TikTok دیده شده.</h2>
          <h3 className="text-2xl font-semibold text-gray-700">آخرین مدل‌ها رو داشته باشید</h3>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* The Penny Loafer */}
          <div className="group">
            <LocalizedClientLink href="/products/penny-loafer">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img 
                  src="/images/rothys/products/penny-loafer-syrah.jpg" 
                  alt="زن در حال پوشیدن پنی لوفر سیاه"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center rtl:text-right">
                <h4 className="font-semibold text-gray-900 mb-1">پنی لوفر</h4>
                <p className="text-sm text-gray-600">شروع از ۱۶۵€</p>
              </div>
            </LocalizedClientLink>
          </div>

          {/* The Almond Slingback */}
          <div className="group">
            <LocalizedClientLink href="/products/almond-slingback">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img 
                  src="/images/rothys/products/almond-slingback-red.jpg" 
                  alt="زن نشسته روی پله‌ها با سویشر کرم و اسلینگ‌بک آلفا"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center rtl:text-right">
                <h4 className="font-semibold text-gray-900 mb-1">اسلینگ‌بک آلفا</h4>
                <p className="text-sm text-gray-600">شروع از ۱۵۵€</p>
              </div>
            </LocalizedClientLink>
          </div>

          {/* The Double Buckle Mary Jane */}
          <div className="group">
            <LocalizedClientLink href="/products/double-buckle-mary-jane">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img 
                  src="/images/rothys/products/double-buckle-mary-jane.jpg" 
                  alt="زن در حال پوشیدن ماری جین دولبه Revelvet در سیرا"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center rtl:text-right">
                <h4 className="font-semibold text-gray-900 mb-1">ماری جین دولبه</h4>
                <p className="text-sm text-gray-600">شروع از ۱۷۵€</p>
              </div>
            </LocalizedClientLink>
          </div>

          {/* The Casual Clog */}
          <div className="group">
            <LocalizedClientLink href="/products/casual-clog">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img 
                  src="/images/rothys/products/casual-clog-dove.jpg" 
                  alt="زن در حال پوشیدن کلاک کژوال در کبوتر"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center rtl:text-right">
                <h4 className="font-semibold text-gray-900 mb-1">کلاک کژوال</h4>
                <p className="text-sm text-gray-600">شروع از ۱۴۵€</p>
              </div>
            </LocalizedClientLink>
          </div>
        </div>

        {/* Matching Mini Section */}
        <div className="mt-16 text-center">
          <div className="relative bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl overflow-hidden py-12 px-8">
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="aspect-square bg-white rounded-lg overflow-hidden">
                  <img 
                    src="/images/rothys/products/max-mary-jane-syra.jpg" 
                    alt="سبک‌های جفت مادر و فرزند"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">با کوچولو خود جفت شوید</h3>
                  <LocalizedClientLink 
                    href="/categories/matching-mini"
                    className="inline-block bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                  >
                    خرید سبک‌های جفت
                  </LocalizedClientLink>
                </div>
                <div className="aspect-square bg-white rounded-lg overflow-hidden">
                  <img 
                    src="/images/rothys/products/penny-loafer-syrah.jpg" 
                    alt="مادر و فرزند با هم در حال راه رفتن"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
