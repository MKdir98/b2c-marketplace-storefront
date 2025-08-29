"use client"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export const StatsSection = () => {
  const t = useTranslations("home")
  const [counts, setCounts] = useState({ products: 0, customers: 0, orders: 0 })

  // Animation effect for counting up numbers
  useEffect(() => {
    const targetCounts = { products: 1500, customers: 3200, orders: 8500 }
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setCounts({
        products: Math.floor(targetCounts.products * progress),
        customers: Math.floor(targetCounts.customers * progress),
        orders: Math.floor(targetCounts.orders * progress)
      })

      if (currentStep >= steps) {
        setCounts(targetCounts)
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      number: counts.products.toLocaleString('fa-IR'),
      label: t("stats.products"),
      icon: "📦"
    },
    {
      number: counts.customers.toLocaleString('fa-IR'),
      label: t("stats.customers"),
      icon: "👥"
    },
    {
      number: counts.orders.toLocaleString('fa-IR'),
      label: t("stats.orders"),
      icon: "📊"
    }
  ]

  return (
    <section className="bg-tertiary container py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-6">
            {/* Icon */}
            <div className="text-4xl mb-4">
              {stat.icon}
            </div>
            
            {/* Number */}
            <div className="text-4xl font-bold text-tertiary mb-2" dir="ltr">
              {stat.number}+
            </div>
            
            {/* Label */}
            <p className="text-lg text-tertiary/80">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
} 