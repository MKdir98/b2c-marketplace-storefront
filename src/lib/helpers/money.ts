import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  // For Iranian Rial, show custom format with "ریال"
  if (currency_code?.toLowerCase() === 'irr') {
    const formattedAmount = new Intl.NumberFormat('fa-IR', {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount)
    return `${formattedAmount} ریال`
  }
  
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}
