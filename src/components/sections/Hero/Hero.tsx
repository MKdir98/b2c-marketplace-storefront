"use client"
import { useState, useEffect } from "react"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { Button } from "@/components/atoms"
import { ArrowRightIcon, ArrowLeftIcon } from "@/icons"

const carouselSlides = [
  {
    id: 1,
    image: "/images/rothys/products/max-mary-jane-syra.jpg",
    title: "کلکسیون جدید دست‌ساز",
    subtitle: "محصولات منحصربه‌فرد با بالاترین کیفیت",
    description: "از هنرمندان ایرانی با عشق ساخته شده",
    cta: "همین الان خرید کن",
    badge: "تازه رسیده!"
  },
  {
    id: 2,
    image: "/images/rothys/products/almond-slingback-red.jpg", 
    title: "اکسسوری‌های خاص",
    subtitle: "زیبایی را به استایل خود اضافه کنید",
    description: "انتخاب گسترده‌ای از کیف، جواهرات و اکسسوری",
    cta: "کلکسیون را ببین",
    badge: "پرفروش"
  },
  {
    id: 3,
    image: "/images/rothys/products/penny-loafer-syrah.jpg",
    title: "صنایع دستی اصیل",
    subtitle: "هنر سنتی با طراحی مدرن",
    description: "محصولات صنایع دستی با کیفیت بالا و طراحی منحصربه‌فرد",
    cta: "کاوش در مجموعه",
    badge: "محصولات ویژه"
  },
  {
    id: 4,
    image: "/images/rothys/products/casual-clog-dove.jpg",
    title: "مد معاصر",
    subtitle: "آخرین ترندهای دنیای مد",
    description: "انتخاب‌های استایل برای هر سلیقه و مناسبت",
    cta: "شروع خرید",
    badge: "ترند جدید"
  }
]

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
      }, 5000) // Change slide every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const currentSlideData = carouselSlides[currentSlide]

  return (
    <section className="w-full relative">
      {/* Hero Carousel */}
      <div className="relative w-full overflow-hidden h-[70vh] md:h-[80vh] lg:h-[90vh]">
        
        {/* Slides Container */}
        <div 
          className="flex w-full h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselSlides.map((slide, index) => (
            <div key={slide.id} className="min-w-full h-full relative">
              {/* Background Image */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10"></div>
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="container mx-auto px-4 lg:px-8">
                  <div className="max-w-2xl">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-6 py-2 mb-6 shadow-lg">
                      <span className="text-sm font-bold">✨ {slide.badge}</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-white/90 mb-4">
                      {slide.subtitle}
                    </h2>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed">
                      {slide.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <LocalizedClientLink href="/products">
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                          🛍️ {slide.cta}
                        </Button>
                      </LocalizedClientLink>
                      
                      <LocalizedClientLink href="/categories">
                        <Button className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 px-8 py-4 text-lg font-medium rounded-full transition-all">
                          مشاهده دسته‌بندی‌ها
                        </Button>
                      </LocalizedClientLink>
                    </div>

                    {/* Special Offer */}
                    <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-lg px-4 py-2">
                      <span className="text-sm">🎁 ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all hover:scale-110"
        >
          <ArrowRightIcon className="w-6 h-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all hover:scale-110"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-30">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
            style={{ 
              width: `${((currentSlide + 1) / carouselSlides.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-purple-900 text-white py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            <LocalizedClientLink href="/categories/handmade" className="group">
              <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all group-hover:scale-105">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="text-xl font-bold mb-2">محصولات دست‌ساز</h3>
                <p className="text-white/80">کار دستان هنرمندان ایرانی</p>
              </div>
            </LocalizedClientLink>

            <LocalizedClientLink href="/categories/fashion" className="group">
              <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all group-hover:scale-105">
                <div className="text-3xl mb-3">👗</div>
                <h3 className="text-xl font-bold mb-2">مد و پوشاک</h3>
                <p className="text-white/80">جدیدترین ترندهای دنیای مد</p>
              </div>
            </LocalizedClientLink>

            <LocalizedClientLink href="/categories/accessories" className="group">
              <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all group-hover:scale-105">
                <div className="text-3xl mb-3">💎</div>
                <h3 className="text-xl font-bold mb-2">اکسسوری و جواهرات</h3>
                <p className="text-white/80">زیبایی را کامل کنید</p>
              </div>
            </LocalizedClientLink>

          </div>
        </div>
      </div>
    </section>
  )
}
