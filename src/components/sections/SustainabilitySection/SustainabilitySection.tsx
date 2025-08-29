"use client"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { useTranslations } from "next-intl"

export const SustainabilitySection = () => {
  const t = useTranslations("home.rothys")

  return (
    <section className="w-full bg-gradient-to-br from-green-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Sustainability Message */}
        <div className="text-center mb-12">
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Left Side - Image */}
              <div className="aspect-[4/3] lg:aspect-auto">
                <img 
                  src="/images/rothys/hero/revelvet-hero-desktop.jpg" 
                  alt="بطری‌های بازیافتی استفاده شده در محصولات Rothys"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Side - Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center rtl:text-right">
                <div className="mb-6">
                  <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                    ۲۰۰,۶۴۷,۲۰۲+
                  </h2>
                  <p className="text-xl lg:text-2xl text-gray-700 mb-6">
                    میلیون‌ها بطری بازیافتی فقط ابتدای کار ماست.
                  </p>
                  <LocalizedClientLink 
                    href="/sustainability"
                    className="inline-block bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                  >
                    بیشتر بدانید
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Image */}
        <div className="text-center">
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-[16/9]">
              <img 
                src="/images/rothys/hero/revelvet-hero-desktop.jpg" 
                alt="نمای داخلی فروشگاه Rothys"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute bottom-6 right-6 text-white rtl:text-right">
                <h3 className="text-2xl font-bold">از فروشگاه‌های ما دیدن کنید</h3>
                <p className="text-sm opacity-90">Rothys را از نزدیک تجربه کنید</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sustainability Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="text-center bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-4">♻️</div>
            <h4 className="font-semibold text-gray-900 mb-2">مواد بازیافتی</h4>
            <p className="text-sm text-gray-600">ساخته شده از بطری‌های پلاستیکی مصرف شده و زباله‌های دریایی</p>
          </div>

          <div className="text-center bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-4">🌊</div>
            <h4 className="font-semibold text-gray-900 mb-2">قابل شستشو در ماشین لباسشویی</h4>
            <p className="text-sm text-gray-600">وقتی کثیف شدن، اونها رو تو ماشین لباسشویی بندازید - خیلی ساده</p>
          </div>

          <div className="text-center bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-4">🌱</div>
            <h4 className="font-semibold text-gray-900 mb-2">خنثی کربن</h4>
            <p className="text-sm text-gray-600">جای پای کربنی خود را جبران می‌کنیم تا به حفاظت از سیاره کمک کنیم</p>
          </div>
        </div>

        {/* Shopping Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            قیمت‌ها شامل VAT و عوارض می‌شوند. تخفیف‌ها در زمان تسویه حساب محاسبه می‌شوند.
          </p>
        </div>
      </div>
    </section>
  )
}
