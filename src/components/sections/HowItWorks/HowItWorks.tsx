import { useTranslations } from "next-intl"

export const HowItWorks = () => {
  const t = useTranslations("home")

  const steps = [
    {
      number: "۱",
      title: t("howItWorks.step1.title"),
      description: t("howItWorks.step1.description"),
      icon: "🔍"
    },
    {
      number: "۲", 
      title: t("howItWorks.step2.title"),
      description: t("howItWorks.step2.description"),
      icon: "🛒"
    },
    {
      number: "۳",
      title: t("howItWorks.step3.title"),
      description: t("howItWorks.step3.description"),
      icon: "😊"
    }
  ]

  return (
    <section className="bg-secondary container py-12">
      <div className="text-center mb-12">
        <h2 className="heading-lg text-secondary uppercase mb-4">
          {t("sections.howItWorks")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="text-center p-6">
            {/* Step Number Circle */}
            <div className="w-16 h-16 bg-action text-action-on-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {step.number}
            </div>
            
            {/* Icon */}
            <div className="text-4xl mb-4">
              {step.icon}
            </div>
            
            {/* Content */}
            <h3 className="heading-sm text-secondary mb-3">
              {step.title}
            </h3>
            <p className="text-md text-tertiary">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
} 