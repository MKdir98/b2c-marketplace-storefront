"use client"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

const newArrivalProducts = [
  {
    id: 1,
    name: "هدست گیمینگ HyperX",
    price: "1,850,000",
    image: "/images/rothys/products/max-mary-jane-syra.jpg",
    href: "/products/hyperx-headset",
    category: "الکترونیکی",
    isNew: true,
    addedDays: 2,
    colors: ["مشکی", "قرمز", "سفید"]
  },
  {
    id: 2,  
    name: "کفش کتانی Adidas",
    price: "2,200,000",
    image: "/images/rothys/products/penny-loafer-syrah.jpg",
    href: "/products/adidas-sneakers",
    category: "پوشاک",
    isNew: true,
    addedDays: 1,
    colors: ["سفید", "مشکی", "آبی"]
  },
  {
    id: 3,
    name: "شارژر بی‌سیم Anker",
    price: "650,000",
    image: "/images/rothys/products/almond-slingback-red.jpg", 
    href: "/products/anker-wireless-charger",
    category: "لوازم جانبی",
    isNew: true,
    addedDays: 3,
    colors: ["مشکی", "سفید"]
  },
  {
    id: 4,
    name: "کیف لپ‌تاپ چرمی",
    price: "890,000",
    image: "/images/rothys/products/casual-clog-dove.jpg",
    href: "/products/leather-laptop-bag",
    category: "کیف و کوله",
    isNew: true,
    addedDays: 1,
    colors: ["قهوه‌ای", "مشکی", "تن"]
  },
  {
    id: 5,
    name: "ساعت هوشمند Fitbit",
    price: "3,400,000",
    image: "/images/rothys/products/double-buckle-mary-jane.jpg",
    href: "/products/fitbit-smartwatch",
    category: "ساعت هوشمند",
    isNew: true,
    addedDays: 2,
    colors: ["مشکی", "نقره‌ای", "رزگلد"]
  },
  {
    id: 6,
    name: "کلاه بیسبال Nike",
    price: "480,000",
    image: "/images/rothys/products/max-mary-jane-syra.jpg",
    href: "/products/nike-baseball-cap",
    category: "اکسسوری",
    isNew: true,
    addedDays: 1,
    colors: ["مشکی", "سفید", "آبی", "قرمز"]
  }
]

export const NewArrivals = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            تازه‌ها 🆕
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            جدیدترین محصولات با بهترین کیفیت تازه رسیده
          </p>
          
          {/* Quick Filter Tabs */}
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            {["همه", "الکترونیکی", "پوشاک", "لوازم جانبی", "اکسسوری"].map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  index === 0 
                    ? "bg-green-500 text-white" 
                    : "bg-white text-gray-700 hover:bg-green-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* New Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {newArrivalProducts.map((product) => (
            <div key={product.id} className="group">
              <LocalizedClientLink href={product.href} className="block">
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group-hover:scale-105">
                  
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* New Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
                        🆕 جدید
                      </span>
                    </div>
                    
                    {/* Days Added Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {product.addedDays} روز پیش
                      </span>
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white text-gray-900 w-10 h-10 rounded-full shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
                        ❤️
                      </button>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    
                    {/* Category */}
                    <div className="mb-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    
                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Colors Available */}
                    <div className="mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">رنگ‌ها:</span>
                        <div className="flex gap-1">
                          {product.colors.slice(0, 3).map((color, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                              {color}
                            </span>
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{product.colors.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-xl font-bold text-gray-900">
                        {parseInt(product.price).toLocaleString()} ت
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm">
                        افزودن به سبد
                      </button>
                      <button className="px-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                        👁
                      </button>
                    </div>
                    
                  </div>
                </div>
              </LocalizedClientLink>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left Content */}
            <div className="text-center md:text-right">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                اولین باش! 🚀
              </h3>
              <p className="text-gray-600 mb-4">
                از آخرین محصولات جدید با خبر باش
              </p>
              
              {/* Newsletter Signup */}
              <div className="flex gap-2 max-w-sm mx-auto md:mx-0">
                <input 
                  type="email" 
                  placeholder="ایمیل خود را وارد کنید"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  عضویت
                </button>
              </div>
            </div>
            
            {/* Right Stats */}
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">۵۰+</div>
                <div className="text-sm text-gray-600">محصول جدید این ماه</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">۲۴/۷</div>
                <div className="text-sm text-gray-600">بروزرسانی محصولات</div>
              </div>
            </div>
            
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <LocalizedClientLink href="/products/new-arrivals">
            <button className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              مشاهده همه تازه‌ها →
            </button>
          </LocalizedClientLink>
        </div>

      </div>
    </section>
  )
} 