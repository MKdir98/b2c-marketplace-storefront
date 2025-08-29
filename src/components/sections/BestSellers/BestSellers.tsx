"use client"
import { useState, useRef } from "react"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { ArrowLeftIcon, ArrowRightIcon } from "@/icons"

const bestSellerProducts = [
  {
    id: 1,
    name: "هدفون بی‌سیم اپل",
    price: "2,450,000",
    originalPrice: "2,850,000",
    discount: "14%",
    rating: 4.8,
    sales: 156,
    image: "/images/rothys/products/max-mary-jane-syra.jpg",
    href: "/products/apple-airpods",
    badge: "پرفروش"
  },
  {
    id: 2,
    name: "کفش ورزشی نایک",
    price: "1,280,000", 
    originalPrice: "1,450,000",
    discount: "12%",
    rating: 4.6,
    sales: 203,
    image: "/images/rothys/products/penny-loafer-syrah.jpg",
    href: "/products/nike-shoes",
    badge: "محبوب"
  },
  {
    id: 3,
    name: "ساعت هوشمند سامسونگ",
    price: "3,200,000",
    originalPrice: "3,600,000", 
    discount: "11%",
    rating: 4.7,
    sales: 89,
    image: "/images/rothys/products/almond-slingback-red.jpg",
    href: "/products/samsung-watch",
    badge: "جدید"
  },
  {
    id: 4,
    name: "لپ‌تاپ ایسوس",
    price: "18,500,000",
    originalPrice: "21,000,000",
    discount: "12%", 
    rating: 4.5,
    sales: 67,
    image: "/images/rothys/products/casual-clog-dove.jpg",
    href: "/products/asus-laptop",
    badge: "پیشنهاد ویژه"
  },
  {
    id: 5,
    name: "گوشی شیائومی",
    price: "4,850,000",
    originalPrice: "5,200,000",
    discount: "7%",
    rating: 4.4,
    sales: 124,
    image: "/images/rothys/products/double-buckle-mary-jane.jpg",
    href: "/products/xiaomi-phone",
    badge: "پرفروش"
  },
  {
    id: 6,
    name: "دوربین کانن",
    price: "12,300,000",
    originalPrice: "13,500,000",
    discount: "9%",
    rating: 4.9,
    sales: 43,
    image: "/images/rothys/products/max-mary-jane-syra.jpg",
    href: "/products/canon-camera",
    badge: "حرفه‌ای"
  }
]

export const BestSellers = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = 320 // width + margin
      container.scrollTo({
        left: container.scrollLeft - cardWidth * 2,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = 320 // width + margin  
      container.scrollTo({
        left: container.scrollLeft + cardWidth * 2,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              پرفروش‌ترین‌ها 🏆
            </h2>
            <p className="text-gray-600">
              محصولاتی که همه دوستشون دارن
            </p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-2">
            <button 
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ArrowLeftIcon color="#374151" size={20} />
            </button>
            <button 
              onClick={scrollRight}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ArrowRightIcon color="#374151" size={20} />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {bestSellerProducts.map((product) => (
              <div 
                key={product.id}
                className="flex-none w-80"
                style={{ scrollSnapAlign: 'start' }}
              >
                <LocalizedClientLink href={product.href} className="block group">
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
                    
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          {product.badge}
                        </span>
                      </div>
                      
                      {/* Discount Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          {product.discount} تخفیف
                        </span>
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      
                      {/* Product Name */}
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      
                      {/* Rating & Sales */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-sm text-gray-600 mr-1">{product.rating}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-600">{product.sales} فروش</span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold text-gray-900">
                          {product.price.toLocaleString()} ت
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice.toLocaleString()} ت
                        </span>
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        افزودن به سبد
                      </button>
                      
                    </div>
                  </div>
                </LocalizedClientLink>
              </div>
            ))}
          </div>
          
          {/* Mobile scroll indicator */}
          <div className="flex justify-center mt-4 md:hidden">
            <div className="flex gap-1">
              {Array.from({ length: Math.ceil(bestSellerProducts.length / 2) }).map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-10">
          <LocalizedClientLink href="/products/best-sellers">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              مشاهده همه پرفروش‌ها →
            </button>
          </LocalizedClientLink>
        </div>

      </div>
    </section>
  )
} 