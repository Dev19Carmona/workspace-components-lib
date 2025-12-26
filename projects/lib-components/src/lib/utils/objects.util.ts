import type { IPrimeNgSelection } from '../components/prime-ng/interfaces'

export const hasValues = (obj: Record<string, any>): boolean => {
  return Object.values(obj).some(value => value !== null && value !== undefined)
}

/**
 * Elimina las propiedades de un objeto que tengan valores null o undefined.
 * Retorna un nuevo objeto sin mutar el original.
 * @param obj - Objeto del cual se eliminarán las propiedades null/undefined
 * @returns Nuevo objeto sin las propiedades con valores null o undefined
 */
export const removeNullUndefined = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: Partial<T> = {}

  Object.keys(obj).forEach(key => {
    const value = obj[key]
    if (value !== null && value !== undefined) {
      result[key as keyof T] = value
    }
  })

  return result
}

/**
 * Realiza un upsert en un array de strings. Si el string ya existe, no hace nada.
 * Si no existe, lo agrega al array.
 * @param targetArray - Array de strings donde se realizará el upsert
 * @param value - String o array de strings a insertar
 * @returns Array actualizado con los nuevos valores
 */
export const upsertArrayStrings = (targetArray: string[], value: string | string[]): string[] => {
  // Crear una copia del array original para evitar mutaciones
  const result = [...targetArray]

  // Convertir el valor a array para procesamiento uniforme
  const valuesToInsert = Array.isArray(value) ? value : [value]

  // Procesar cada valor
  valuesToInsert.forEach(stringValue => {
    // Solo agregar si no existe en el array
    if (!result.includes(stringValue)) {
      result.push(stringValue)
    }
  })

  return result
}

export const sameArray = (arr1: unknown[], arr2: unknown[]): boolean => {
  if (arr1.length !== arr2.length) return false

  const sorted1 = Array.from(arr1).sort()
  const sorted2 = Array.from(arr2).sort()

  return sorted1.every((item, index) => item === sorted2[index])
}

export const getOptionByCode = <T>(options: IPrimeNgSelection<T>[], code: T | undefined): IPrimeNgSelection<T> | undefined => {
  if (!code) return undefined
  return options.find((item) => item.code === code)
}

export const createEnumeratedList = (items: string[]): string => {
  if (items.length === 0) {
    return ''
  }

  if (items.length === 1) {
    return `1. ${items[0]}`
  }

  return items
    .map((item, index) => `${index + 1}. ${item}`)
    .join('\n')
}
