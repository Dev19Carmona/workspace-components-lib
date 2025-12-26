export class CookieUtil {
  /**
   * Obtiene el valor de una cookie por su nombre
   * @param name - Nombre de la cookie
   * @returns El valor de la cookie o null si no existe
   */
  static getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      return null
    }

    const nameEQ = name + '='
    const ca = document.cookie.split(';')

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length)
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length)
      }
    }
    return null
  }

  /**
   * Establece una cookie
   * @param name - Nombre de la cookie
   * @param value - Valor de la cookie
   * @param days - Días hasta que expire (por defecto 365)
   * @param path - Ruta de la cookie (por defecto '/')
   */
  static setCookie(name: string, value: string, days: number = 365, path: string = '/'): void {
    if (typeof document === 'undefined') {
      return
    }

    let expires = ''
    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      expires = '; expires=' + date.toUTCString()
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=' + path
  }

  /**
   * Elimina una cookie
   * @param name - Nombre de la cookie a eliminar
   * @param path - Ruta de la cookie (por defecto '/')
   */
  static eraseCookie(name: string, path: string = '/'): void {
    if (typeof document === 'undefined') {
      return
    }

    document.cookie = name + '=; Path=' + path + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  }

  /**
   * Obtiene un valor booleano desde una cookie
   * @param name - Nombre de la cookie
   * @param defaultValue - Valor por defecto si la cookie no existe
   * @returns El valor booleano
   */
  static getBooleanCookie(name: string, defaultValue: boolean = false): boolean {
    const value = this.getCookie(name)
    if (value === null) {
      return defaultValue
    }
    return value === 'true'
  }

  /**
   * Establece un valor booleano en una cookie
   * @param name - Nombre de la cookie
   * @param value - Valor booleano
   * @param days - Días hasta que expire (por defecto 365)
   * @param path - Ruta de la cookie (por defecto '/')
   */
  static setBooleanCookie(name: string, value: boolean, days: number = 365, path: string = '/'): void {
    this.setCookie(name, value.toString(), days, path)
  }
}
