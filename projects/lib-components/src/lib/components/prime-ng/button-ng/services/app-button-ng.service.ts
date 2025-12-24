import { computed, effect, inject, Injectable, type Signal, signal } from '@angular/core'
import type { IButtonConfig } from '../interfaces'

@Injectable({
  providedIn: 'root'
})
export class AppButtonNgService {
  private buttonConfig = signal<IButtonConfig>({} as IButtonConfig)

  constructor() {
    // Effect para manejar automáticamente la rotación de mensajes
    effect(() => {
      const config = this.buttonConfig()
      if (config.loading && config.loadingMessages && config.loadingMessages.length > 1) {
        this.startMessageRotation()
      } else {
        this.stopMessageRotation()
      }
    })
  }

  setButtonConfig(buttonConfig: IButtonConfig) {
    this.buttonConfig.set(buttonConfig)
  }

  // Computed público para acceder al label dinámico
  public readonly label: Signal<string> = computed(() => {
    const config = this.buttonConfig()

    // Si está cargando y tiene mensajes de carga, rotar entre ellos
    if (config.loading && config.loadingMessages && config.loadingMessages.length > 0) {
      const messages = config.loadingMessages
      const index = this.messageIndex() % messages.length // Wrap around
      return messages[index]
    }

    // Si no está cargando, retornar el label normal
    return config.label ? config.label : ''
  })

  //#region Loading Messages
  private messageIndex = signal(0)
  private intervalId?: ReturnType<typeof setInterval>

  private startMessageRotation() {
    if (this.intervalId) return

    this.intervalId = setInterval(() => {
      this.messageIndex.update(index => index + 1)
    }, 6000)
  }

  private stopMessageRotation() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
      this.messageIndex.set(0)
    }
  }
  //#endregion
}
