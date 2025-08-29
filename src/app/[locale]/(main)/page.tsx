import {
  Hero,
  RothysProductShowcase,
  SocialProofSection,
  SustainabilitySection,
  NewsletterSection,
  SocialSection,
  CategoryShowcase,
  FanFaveSlingbacks,
  MatchYourMini,
  PopularCategories,
  BestSellers,
  FeaturedSellers,
  SpecialOffers,
  NewArrivals,
} from "@/components/sections"
import { useTranslations } from "next-intl"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "innjaa - محصولات دست‌ساز و مد",
  description:
    "بازارگاه آنلاین محصولات دست‌ساز، مد، الکترونیکی و خانگی با کیفیت عالی و قیمت مناسب.",
  openGraph: {
    title: "innjaa - محصولات دست‌ساز و مد",
    description:
      "بازارگاه آنلاین محصولات دست‌ساز، مد، الکترونیکی و خانگی با کیفیت عالی و قیمت مناسب.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "innjaa",
    type: "website",
    images: [
      {
        url: "/images/rothys/products/max-mary-jane-syra.jpg",
        width: 1200,
        height: 630,
        alt: "innjaa - محصولات دست‌ساز و مد",
      },
    ],
  },
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations("home.sections")
  
  return (
    <main className="flex flex-col row-start-2">
      {/* Hero Section */}
      <Hero />
      
      {/* دسته‌بندی‌های محبوب */}
      <PopularCategories />
      
      {/* پرفروش‌ترین‌ها */}
      <BestSellers />
      
      {/* فروشنده‌های منتخب */}
      <FeaturedSellers />
      
      {/* تخفیف‌های ویژه */}
      <SpecialOffers />
      
      {/* تازه‌ها */}
      <NewArrivals />
      
      {/* شبکه‌های اجتماعی */}
      <SocialSection />
    </main>
  )
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return <HomeContent locale={locale} />
}
