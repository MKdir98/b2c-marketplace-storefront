import { useTranslations } from "next-intl"

export const TrustIndicators = () => {
  const t = useTranslations("home")

  const indicators = [
    {
      title: t("trust.secure.title"),
      description: t("trust.secure.description"),
      icon: "🔒"
    },
    {
      title: t("trust.guarantee.title"),
      description: t("trust.guarantee.description"),
      icon: "✅"
    },
    {
      title: t("trust.support.title"),
      description: t("trust.support.description"),
      icon: "💬"
    }
  ]

  return (
    <section className="bg-primary container py-12">
      <div className="text-center mb-12">
        <h2 className="heading-lg text-primary uppercase mb-4">
          {t("sections.trustIndicators")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {indicators.map((indicator, index) => (
          <div key={index} className="text-center p-6 border border-secondary rounded-lg hover:shadow-lg transition-shadow">
            {/* Icon */}
            <div className="text-5xl mb-4">
              {indicator.icon}
            </div>
            
            {/* Content */}
            <h3 className="heading-sm text-primary mb-3">
              {indicator.title}
            </h3>
            <p className="text-md text-secondary">
              {indicator.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
} 