export const formatCurrency = (amount: number, locale: string = "en-ZA", currency: string = "ZAR"): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}