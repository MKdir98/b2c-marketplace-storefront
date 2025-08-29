"use client"
import { useState, useEffect } from "react"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

const specialOffers = [
  {
    id: 1,
    title: "فلش سیل ۲۴ ساعته",
    description: "تخفیف‌های شگفت‌انگیز فقط تا پایان امروز",
    discount: "تا ۷۰٪",
    originalPrice: "از ۱,۵۰۰,۰۰۰ ت",
    salePrice: "از ۴۵۰,۰۰۰ ت", 
    image: "/images/rothys/products/max-mary-jane-syra.jpg",
    href: "/offers/flash-sale",
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    badge: "🔥 داغ",
    bgColor: "from-red-500 to-pink-600"
  },
  {
    id: 2,
    title: "هفته طلایی الکترونیک",
    description: "بهترین برندها با قیمت‌های باورنکردنی",
    discount: "تا ۵۰٪",
    originalPrice: "از ۲,۰۰۰,۰۰۰ ت",
    salePrice: "از ۱,۰۰۰,۰۰۰ ت",
    image: "/images/rothys/products/penny-loafer-syrah.jpg",
    href: "/offers/electronics-week",
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    badge: "⚡ ویژه",
    bgColor: "from-blue-500 to-purple-600"
  }
]

export const SpecialOffers = () => {
  const [timeLeft, setTimeLeft] = useState<{[key: number]: {hours: number, minutes: number, seconds: number}}>({})

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: typeof timeLeft = {}
      
      specialOffers.forEach((offer) => {
        const now = new Date().getTime()
        const endTime = offer.endTime.getTime()
        const difference = endTime - now
        
        if (difference > 0) {
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)
          
          newTimeLeft[offer.id] = { hours, minutes, seconds }
        } else {
          newTimeLeft[offer.id] = { hours: 0, minutes: 0, seconds: 0 }
        }
      })
      
      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            تخفیف‌های ویژه 🎉
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            فرصت‌های طلایی که نباید از دست بدید
          </p>
        </div>

        {/* Special Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {specialOffers.map((offer) => (
            <div key={offer.id} className="group">
              <LocalizedClientLink href={offer.href} className="block">
                <div className={`relative bg-gradient-to-br ${offer.bgColor} rounded-3xl p-8 text-white overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 group-hover:scale-105`}>
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    
                    {/* Badge */}
                    <div className="flex justify-between items-start mb-6">
                      <span className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {offer.badge}
                      </span>
                      
                      {/* Discount */}
                      <div className="text-right">
                        <div className="text-3xl md:text-4xl font-bold">
                          {offer.discount}
                        </div>
                        <div className="text-sm opacity-90">تخفیف</div>
                      </div>
                    </div>
                    
                    {/* Title & Description */}
                    <div className="mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        {offer.title}
                      </h3>
                      <p className="opacity-90 text-lg">
                        {offer.description}
                      </p>
                    </div>
                    
                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold">
                          {offer.salePrice}
                        </span>
                        <span className="text-lg opacity-70 line-through">
                          {offer.originalPrice}
                        </span>
                      </div>
                    </div>
                    
                    {/* Countdown Timer */}
                    <div className="mb-6">
                      <div className="text-sm opacity-90 mb-2">⏰ باقیمانده:</div>
                      <div className="flex gap-2">
                        {timeLeft[offer.id] && (
                          <>
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2 text-center min-w-[60px]">
                              <div className="text-xl font-bold">{timeLeft[offer.id].hours}</div>
                              <div className="text-xs opacity-80">ساعت</div>
                            </div>
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2 text-center min-w-[60px]">
                              <div className="text-xl font-bold">{timeLeft[offer.id].minutes}</div>
                              <div className="text-xs opacity-80">دقیقه</div>
                            </div>
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2 text-center min-w-[60px]">
                              <div className="text-xl font-bold">{timeLeft[offer.id].seconds}</div>
                              <div className="text-xs opacity-80">ثانیه</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg text-lg">
                      مشاهده پیشنهادها →
                    </button>
                    
                  </div>
                  
                  {/* Decorative Image */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
                    <img 
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  
                </div>
              </LocalizedClientLink>
            </div>
          ))}
        </div>

        {/* Quick Deals */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                پیشنهادات ویژه امروز ⚡
              </h3>
              <p className="text-gray-600">
                تخفیف‌های محدود و بی‌نظیر فقط برای امروز
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "الکترونیکی", discount: "۳۵٪", icon: "📱" },
                { name: "پوشاک", discount: "۲۸٪", icon: "👕" },
                { name: "خانه", discount: "۴۲٪", icon: "🏠" },
                { name: "ورزشی", discount: "۳۰٪", icon: "⚽" }
              ].map((item, index) => (
                <div key={index} className="text-center p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-lg font-semibold text-gray-900">{item.name}</div>
                  <div className="text-red-500 font-bold">تا {item.discount}</div>
                </div>
              ))}
            </div>
            
          </div>
        </div>

      </div>
    </section>
  )
} 