"use client"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

const featuredSellers = [
  {
    id: 1,
    name: "فروشگاه تکنو پلاس",
    avatar: "/images/rothys/products/max-mary-jane-syra.jpg",
    rating: 4.9,
    reviews: 1,
    sales: 342,
    specialties: ["الکترونیک", "گوشی", "لپ‌تاپ"],
    href: "/seller/techno-plus",
    description: "تخصص در محصولات الکترونیکی اصل",
    badge: "فروشنده برتر",
    verified: true,
    responseTime: "کمتر از 2 ساعت",
    location: "تهران"
  },
  {
    id: 2,
    name: "آتلیه هنری نگین",
    avatar: "/images/rothys/products/penny-loafer-syrah.jpg", 
    rating: 4.8,
    reviews: 89,
    sales: 156,
    specialties: ["صنایع دستی", "نقاشی", "سفال"],
    href: "/seller/nagin-art",
    description: "آثار هنری منحصربه‌فرد و دست‌ساز",
    badge: "هنرمند معتبر",
    verified: true,
    responseTime: "کمتر از 6 ساعت",
    location: "اصفهان"
  },
  {
    id: 3,
    name: "پوشاک مدرن سارا",
    avatar: "/images/rothys/products/almond-slingback-red.jpg",
    rating: 4.7,
    reviews: 203,
    sales: 567,
    specialties: ["پوشاک", "کیف", "کفش"],
    href: "/seller/sara-fashion",
    description: "مد روز با کیفیت عالی",
    badge: "محبوب مشتریان",
    verified: true,
    responseTime: "کمتر از 4 ساعت", 
    location: "شیراز"
  },
  {
    id: 4,
    name: "خانه و زندگی آرمین",
    avatar: "/images/rothys/products/casual-clog-dove.jpg",
    rating: 4.6,
    sales: 289,
    reviews: 145,
    specialties: ["دکوراسیون", "آشپزخانه", "باغبانی"],
    href: "/seller/armin-home",
    description: "هر آنچه برای خانه نیاز دارید",
    badge: "تنوع بالا",
    verified: false,
    responseTime: "کمتر از 12 ساعت",
    location: "مشهد"
  }
]

export const FeaturedSellers = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            فروشنده‌های منتخب ⭐
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            بهترین فروشنده‌ها با بالاترین کیفیت خدمات
          </p>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {featuredSellers.map((seller) => (
            <LocalizedClientLink 
              key={seller.id}
              href={seller.href}
              className="block group"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group-hover:scale-105">
                
                {/* Seller Avatar & Badge */}
                <div className="relative mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                    <img 
                      src={seller.avatar}
                      alt={seller.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Verified Badge */}
                  {seller.verified && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      ✓
                    </div>
                  )}
                  
                  {/* Badge */}
                  <div className="text-center mt-2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {seller.badge}
                    </span>
                  </div>
                </div>
                
                {/* Seller Info */}
                <div className="text-center">
                  
                  {/* Seller Name */}
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {seller.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {seller.description}
                  </p>
                  
                  {/* Rating & Stats */}
                  <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="mr-1 font-semibold">{seller.rating}</span>
                      <span className="mr-1">({seller.reviews})</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span>{seller.sales} فروش</span>
                  </div>
                  
                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap justify-center gap-1">
                      {seller.specialties.slice(0, 3).map((specialty, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Response Time & Location */}
                  <div className="space-y-1 text-xs text-gray-500 mb-4">
                    <div>📍 {seller.location}</div>
                    <div>⏱️ پاسخ‌گویی: {seller.responseTime}</div>
                  </div>
                  
                  {/* Visit Store Button */}
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm">
                    مشاهده فروشگاه
                  </button>
                  
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>

        {/* All Sellers Button */}
        <div className="text-center">
          <LocalizedClientLink href="/sellers">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              مشاهده همه فروشنده‌ها →
            </button>
          </LocalizedClientLink>
        </div>

      </div>
    </section>
  )
} 