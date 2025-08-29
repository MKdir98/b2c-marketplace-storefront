import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { useTranslations } from "next-intl"

interface CategoryCardProps {
  title: string
  subtitle?: string
  image: string
  href: string
  featured?: boolean
}

const CategoryCard = ({ title, subtitle, image, href, featured = false }: CategoryCardProps) => (
  <LocalizedClientLink href={href} className="group">
    <div className={`relative overflow-hidden rounded-2xl ${featured ? 'aspect-[4/3]' : 'aspect-square'} mb-3`}>
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rtl:text-right">
        <h3 className="text-xl font-bold">{title}</h3>
        {subtitle && <p className="text-sm">{subtitle}</p>}
      </div>
    </div>
    <div className="text-center rtl:text-right">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
  </LocalizedClientLink>
)

export const CategoryShowcase = () => {
  const t = useTranslations("home.rothys")

  const categories = [
    {
      title: "کفش زنانه",
      image: "/images/rothys/products/max-mary-jane-syra.jpg",
      href: "/categories/womens-shoes"
    },
    {
      title: "جدیدترین‌ها", 
      image: "/images/rothys/products/penny-loafer-syrah.jpg",
      href: "/categories/new-arrivals"
    },
    {
      title: "پرفروش‌ترین‌ها",
      image: "/images/rothys/products/almond-slingback-red.jpg", 
      href: "/categories/best-sellers"
    },
    {
      title: "کیف و اکسسوری",
      image: "/images/rothys/products/double-buckle-mary-jane.jpg",
      href: "/categories/bags"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard 
              key={index} 
              {...category} 
              featured={index === 0}
            />
          ))}
        </div>
        
        {/* Sustainability Message */}
        <div className="mt-16 text-center bg-green-50 rounded-2xl p-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-green-900">۲۰۰,۶۴۷,۲۰۲+</h3>
            <p className="text-green-800 mb-4">
              میلیون‌ها بطری بازیافتی فقط ابتدای کار ماست.
            </p>
            <LocalizedClientLink 
              href="/sustainability"
              className="inline-block text-green-700 font-semibold hover:text-green-600 transition-colors"
            >
              بیشتر بدانید →
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}
