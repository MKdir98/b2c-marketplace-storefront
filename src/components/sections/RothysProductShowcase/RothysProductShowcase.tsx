"use client"
import { useTranslations } from "next-intl"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { Button } from "@/components/atoms"

export const RothysProductShowcase = () => {
  const t = useTranslations("home")

  const products = [
    {
      id: "penny-loafer",
      name: "پنی لوفر",
      description: "کلاسیک و راحت برای هر روز",
      colors: ["سیاه", "سیرا", "کبوتر", "سرمه‌ای"],
      image: "/images/rothys/products/penny-loafer-syrah.jpg",
      href: "/products/penny-loafer"
    },
    {
      id: "almond-slingback",
      name: "اسلینگ‌بک آلفا",
      description: "شیک و زنانه برای موقعیت‌های خاص",
      colors: ["قرمز آبنباتی", "سیاه", "سیرا"],
      image: "/images/rothys/products/almond-slingback-red.jpg",
      href: "/products/almond-slingback"
    },
    {
      id: "max-mary-jane",
      name: "ماری جین مربعی مکس",
      description: "طراحی مدرن با راحتی کلاسیک",
      colors: ["سیرا", "سیب سرخ", "سبز همیشه‌بهار"],
      image: "/images/rothys/products/max-mary-jane-syra.jpg",
      href: "/products/max-mary-jane"
    },
    {
      id: "double-buckle-mary-jane",
      name: "ماری جین دولبه",
      description: "سبک و راحت با طراحی دوقلوی جذاب",
      colors: ["سیب سرخ", "سیرا", "سیاه"],
      image: "/images/rothys/products/double-buckle-mary-jane.jpg",
      href: "/products/double-buckle-mary-jane"
    },
    {
      id: "casual-clog",
      name: "کلاک کژوال",
      description: "راحت و کاربردی برای روزهای معمولی",
      colors: ["کبوتر", "سیاه", "سیرا"],
      image: "/images/rothys/products/casual-clog-dove.jpg",
      href: "/products/casual-clog"
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            محصولات محبوب ما
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            کفش‌های شستنی از مواد بازیافتی که هم شیک هستن و هم راحت
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <LocalizedClientLink href={product.href}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-6 rtl:text-right">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {product.description}
                    </p>

                    {/* Colors */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">رنگ‌های موجود:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <span
                            key={color}
                            className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">مشاهده جزئیات</span>
                      <Button className="bg-black text-white hover:bg-gray-800 px-4 py-2 text-sm">
                        خرید
                      </Button>
                    </div>
                  </div>
                </div>
              </LocalizedClientLink>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <LocalizedClientLink href="/collections/all">
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
              مشاهده همه محصولات
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
