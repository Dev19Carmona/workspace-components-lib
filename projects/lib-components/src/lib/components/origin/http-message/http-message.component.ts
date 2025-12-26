import { Component, model } from '@angular/core'
import type { IHttpMessage } from './interfaces'

@Component({
  selector: 'app-http-message',
  imports: [],
  templateUrl: './http-message.component.html',
  styleUrl: './http-message.component.scss'
})
export class HttpMessageComponent {
  httpMessage = model<IHttpMessage | undefined>()

  clearMessage(): void {
    this.httpMessage.set(undefined)
  }

  get isError(): boolean {
    const message = this.httpMessage()
    return message?.type === 'error'
  }

  get isSuccess(): boolean {
    const message = this.httpMessage()
    return message?.type === 'success'
  }
}
