export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number)
}

export const fixedNumber = (number: number): number => {
  return Number(number.toFixed(2))
}
