import type { PipeTransform } from '@angular/core'
import { Pipe } from '@angular/core'

@Pipe({
  name: 'keyToDisplayName'
})
export class KeyToDisplayNamePipe implements PipeTransform {

  transform(key: string, keysNames?: Record<string, string>): string {
    return keysNames?.[key] ?? key
  }

}
