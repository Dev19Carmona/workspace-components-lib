export class PrimeNgUtil {
  static isPrimeNgSelection(value: any): boolean {
    return typeof value === 'object' && value !== null && 'name' in value && 'code' in value
  }
}
