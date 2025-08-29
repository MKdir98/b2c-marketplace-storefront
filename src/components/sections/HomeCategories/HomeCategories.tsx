import { useTranslations } from "next-intl"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

interface Category {
  id: number
  name: string
  handle: string
  icon: string
  translationKey: string
}

export const HomeCategories = () => {
  const t = useTranslations("home")

  const categories: Category[] = [
    {
      id: 1,
      name: "Tools",
      handle: "tools",
      icon: "🔧",
      translationKey: "categories.tools"
    },
    {
      id: 2,
      name: "Consultation",
      handle: "consultation",
      icon: "💡",
      translationKey: "categories.consultation"
    },
    {
      id: 3,
      name: "Clothing",
      handle: "clothing",
      icon: "👕",
      translationKey: "categories.clothing"
    },
    {
      id: 4,
      name: "Electronics",
      handle: "electronics",
      icon: "📱",
      translationKey: "categories.electronics"
    },
    {
      id: 5,
      name: "Accessories",
      handle: "accessories",
      icon: "⌚",
      translationKey: "categories.accessories"
    },
    {
      id: 6,
      name: "Sports",
      handle: "sports",
      icon: "⚽",
      translationKey: "categories.sports"
    },
    {
      id: 7,
      name: "Books",
      handle: "books",
      icon: "📚",
      translationKey: "categories.books"
    },
    {
      id: 8,
      name: "Home",
      handle: "home",
      icon: "🏠",
      translationKey: "categories.home"
    }
  ]

  return (
    <section className="bg-primary py-12 w-full">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="heading-lg text-primary uppercase">
            {t("sections.shopByCategory")}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="group flex flex-col items-center p-6 border border-secondary rounded-lg bg-component hover:bg-secondary/10 transition-all duration-300 hover:scale-105"
            >
              {/* Icon */}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              
              {/* Category Name */}
              <h3 className="text-center label-lg text-primary group-hover:text-action transition-colors">
                {t(category.translationKey)}
              </h3>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
