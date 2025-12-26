import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class TableNgGeneralService {

  constructor() { }
  public readonly MOCK_EMPTY_DATE = new Date(1900, 0, 1)
}
