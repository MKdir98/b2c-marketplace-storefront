"use client"

import { convertToLocale } from "@/lib/helpers/money"

export const CartSummary = ({
  item_total,
  shipping_total,
  total,
  currency_code,
  tax,
  show_delivery = true,
  show_tax = true,
  labels,
}: {
  item_total: number
  shipping_total: number
  total: number
  currency_code: string
  tax: number
  show_delivery?: boolean
  show_tax?: boolean
  labels?: {
    items?: string
    delivery?: string
    tax?: string
    total?: string
  }
}) => {
  return (
    <div>
      <div className="space-y-4 label-md text-secondary mb-4">
        <div className="flex justify-between">
          <span>{labels?.items ?? "Items:"}</span>
          <span className="text-primary">
            {convertToLocale({
              amount: item_total,
              currency_code,
            })}
          </span>
        </div>
        {show_delivery && (
          <div className="flex justify-between">
            <span>{labels?.delivery ?? "Delivery:"}</span>
            <span className="text-primary">
              {convertToLocale({
                amount: shipping_total,
                currency_code,
              })}
            </span>
          </div>
        )}
        {show_tax && (
          <div className="flex justify-between">
            <span>{labels?.tax ?? "Tax:"}</span>
            <span className="text-primary">
              {convertToLocale({
                amount: tax,
                currency_code,
              })}
            </span>
          </div>
        )}
        <div className="flex justify-between border-t pt-4 items-center">
          <span>{labels?.total ?? "Total:"}</span>
          <span className="label-xl text-primary">
            {convertToLocale({
              amount: total,
              currency_code,
            })}
          </span>
        </div>
      </div>
    </div>
  )
}
