"use client"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

const popularCategories = [
  {
    id: 1,
    name: "الکترونیکی",
    icon: "📱",
    description: "گوشی، لپ‌تاپ، لوازم جانبی",
    href: "/categories/electronics",
    color: "from-blue-400 to-blue-600",
    productCount: "250+ محصول"
  },
  {
    id: 2,
    name: "پوشاک و مد",
    icon: "👕",
    description: "لباس، کفش، اکسسوری",
    href: "/categories/fashion",
    color: "from-pink-400 to-pink-600", 
    productCount: "180+ محصول"
  },
  {
    id: 3,
    name: "خانه و زندگی",
    icon: "🏠",
    description: "دکوراسیون، آشپزخانه، باغبانی",
    href: "/categories/home",
    color: "from-green-400 to-green-600",
    productCount: "320+ محصول"
  },
  {
    id: 4,
    name: "هنر و صنایع دستی",
    icon: "🎨",
    description: "نقاشی، سفال، دست‌سازها",
    href: "/categories/handmade",
    color: "from-purple-400 to-purple-600",
    productCount: "95+ محصول"
  },
  {
    id: 5,
    name: "ورزش و سرگرمی",
    icon: "⚽",
    description: "لوازم ورزشی، بازی، تفریح",
    href: "/categories/sports",
    color: "from-orange-400 to-orange-600",
    productCount: "140+ محصول"
  },
  {
    id: 6,
    name: "کتاب و فرهنگ",
    icon: "📚",
    description: "کتاب، مجله، لوازم تحریر",
    href: "/categories/books",
    color: "from-indigo-400 to-indigo-600",
    productCount: "200+ محصول"
  }
]

export const PopularCategories = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            دسته‌بندی‌های محبوب 🔥
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            محبوب‌ترین دسته‌بندی‌ها با بهترین کیفیت و قیمت
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCategories.map((category) => (
            <LocalizedClientLink 
              key={category.id}
              href={category.href}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105 border border-gray-100">
                
                {/* Icon with gradient bg */}
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {category.icon}
                </div>
                
                {/* Category Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 text-center mb-3 leading-relaxed">
                  {category.description}
                </p>
                
                {/* Product Count */}
                <div className="text-xs text-gray-500 text-center">
                  {category.productCount}
                </div>
                
              </div>
            </LocalizedClientLink>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-10">
          <LocalizedClientLink href="/categories">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              مشاهده همه دسته‌بندی‌ها →
            </button>
          </LocalizedClientLink>
        </div>

      </div>
    </section>
  )
} 