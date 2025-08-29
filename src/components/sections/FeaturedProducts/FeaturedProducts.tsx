import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

interface ProductCardProps {
  title: string
  image: string
  href: string
}

const ProductCard = ({ title, image, href }: ProductCardProps) => (
  <LocalizedClientLink href={href} className="group">
    <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square mb-3">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <h3 className="font-semibold text-center text-gray-900 group-hover:text-gray-600 transition-colors">
      {title}
    </h3>
  </LocalizedClientLink>
)

export const FeaturedProducts = () => {
  const featuredProducts = [
    {
      title: "THE PENNY LOAFER",
      image: "/images/product/placeholder.jpg",
      href: "/products/penny-loafer"
    },
    {
      title: "THE ALMOND SLINGBACK", 
      image: "/images/product/placeholder.jpg",
      href: "/products/almond-slingback"
    },
    {
      title: "THE DOUBLE BUCKLE MJ",
      image: "/images/product/placeholder.jpg", 
      href: "/products/double-buckle-mary-jane"
    },
    {
      title: "THE CASUAL CLOG",
      image: "/images/product/placeholder.jpg",
      href: "/products/casual-clog"
    }
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-gray-600 mb-2">Seen on TikTok.</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">GET THE LATEST</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
} 