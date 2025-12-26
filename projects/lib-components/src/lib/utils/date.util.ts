export const isSameDay = (date1: Date, date2: Date): boolean => {
  const date1Copy = new Date(date1.setHours(0, 0, 0, 0))
  const date2Copy = new Date(date2.setHours(0, 0, 0, 0))
  return date1Copy.getTime() === date2Copy.getTime()
}

export const formatDateDMA = (date: Date): string => {
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Crea una funcion que tambien muestre la hora
export const formatDateDMAWithTime = (date: Date): string => {
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
