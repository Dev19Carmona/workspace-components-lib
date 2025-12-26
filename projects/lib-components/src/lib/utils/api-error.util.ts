import type { HttpErrorResponse } from '@angular/common/http'
import type { IApiError } from '../../core/interfaces'

/**
 * Utilidades para manejar errores de API según la interfaz IApiError
 */
export class ApiErrorUtil {
  /**
   * Procesa errores de API y extrae el mensaje según la interfaz IApiError
   * @param error - El error HTTP recibido
   * @param fallbackMessage - Mensaje por defecto si no se puede extraer el mensaje del error
   * @returns El mensaje de error procesado
   */
  static handleApiError(error: HttpErrorResponse, fallbackMessage: string): string {
    const apiError = error.error as IApiError
    const errorMessage = Array.isArray(apiError?.message)
      ? apiError.message.join(', ')
      : apiError?.message ?? fallbackMessage
    return errorMessage
  }

  /**
   * Procesa errores de API con información detallada de campos
   * y muestra tanto el mensaje general como los errores específicos de campo
   * @param error - El error HTTP recibido
   * @param fallbackMessage - Mensaje por defecto si no se puede extraer el mensaje del error
   * @returns El mensaje de error procesado con información de campos si está disponible
   */
  static handleApiErrorWithFields(error: HttpErrorResponse, fallbackMessage: string): string {
    const apiError = error.error as IApiError

    let errorMessage = Array.isArray(apiError?.message)
      ? apiError.message.join(', ')
      : apiError?.message ?? fallbackMessage

    // Si hay errores de campo específicos, los agregamos al mensaje
    if (apiError?.errors && apiError.errors.length > 0) {
      const fieldErrors = apiError.errors
        .map(fieldError => `${fieldError.field}: ${fieldError.message}`)
        .join(', ')

      errorMessage = `${errorMessage}. Errores de campos: ${fieldErrors}`
    }

    return errorMessage
  }

  /**
   * Obtiene solo los errores de campo específicos
   * @param error - El error HTTP recibido
   * @returns Array de errores de campo o array vacío si no hay errores
   */
  static getFieldErrors(error: HttpErrorResponse): Array<{ field: string; message: string }> {
    const apiError = error.error as IApiError
    return apiError?.errors ?? []
  }

  /**
   * Verifica si el error tiene errores de campo específicos
   * @param error - El error HTTP recibido
   * @returns true si hay errores de campo, false en caso contrario
   */
  static hasFieldErrors(error: HttpErrorResponse): boolean {
    const apiError = error.error as IApiError
    return apiError?.errors && apiError.errors.length > 0
  }

  /**
   * Obtiene el código de error específico
   * @param error - El error HTTP recibido
   * @returns El código de error o undefined si no está disponible
   */
  static getErrorCode(error: HttpErrorResponse): string | undefined {
    const apiError = error.error as IApiError
    return apiError?.errorCode
  }

  /**
   * Obtiene el timestamp del error
   * @param error - El error HTTP recibido
   * @returns El timestamp del error o undefined si no está disponible
   */
  static getErrorTimestamp(error: HttpErrorResponse): string | undefined {
    const apiError = error.error as IApiError
    return apiError?.timestamp
  }
}
