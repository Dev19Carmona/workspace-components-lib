import type { Signal} from '@angular/core'
import { computed, Injectable, signal } from '@angular/core'
import type { ISpeedDialConfig, TSpeedDialDirection } from '../interfaces'
import type { IButtonConfig } from '../../../prime-ng/button-ng/interfaces'

@Injectable({
  providedIn: 'root'
})
export class SpeedDialService {
  private readonly panelOffset = 10
  private mainButtonHost?: HTMLElement
  private activeAnchor?: HTMLElement
  private readonly _isMenuOpen = signal(false)
  private readonly _panelTop = signal('0px')
  private readonly _panelLeft = signal('0px')

  constructor() { }

  private _speedDialConfig = signal<ISpeedDialConfig>({} as ISpeedDialConfig)
  public speedDialConfig = this._speedDialConfig.asReadonly()
  public isMenuOpen = this._isMenuOpen.asReadonly()
  public panelTop = this._panelTop.asReadonly()
  public panelLeft = this._panelLeft.asReadonly()

  public setSpeedDialConfig(config: ISpeedDialConfig): void {
    this._speedDialConfig.set(config)
    if (this.isMenuOpen()) this.updatePanelPosition()
  }

  public setMainButtonHost(host: HTMLElement): void {
    this.mainButtonHost = host
    if (this.isMenuOpen()) this.updatePanelPosition()
  }

  public buttons: Signal<IButtonConfig[]> = computed(() => {
    return this.speedDialConfig().buttons
  })

  public overlayButtons: Signal<IButtonConfig[]> = computed(() => {
    return this.buttons().map((button) => {
      return {
        ...button,
        onClick: (data?: unknown) => {
          this.closeMenu()
          button.onClick?.(data)
        }
      }
    })
  })

  public mainButton: Signal<IButtonConfig> = computed(() => {
    const rawMainButton = this.speedDialConfig().mainButton
    return {
      ...rawMainButton,
      icon: this.isMenuOpen() ? 'fa-solid fa-xmark' : rawMainButton.icon,
      severity: this.isMenuOpen() ? 'danger' : rawMainButton.severity,
      onClick: (data?: unknown) => {
        rawMainButton.onClick?.(data)
      }
    }
  })

  public direction: Signal<TSpeedDialDirection> = computed(() => {
    return this.speedDialConfig().direction
  })

  public toggleMenu(anchor?: HTMLElement): void {
    const nextState = !this.isMenuOpen()
    this._isMenuOpen.set(nextState)
    this.activeAnchor = anchor ?? this.mainButtonHost
    if (!nextState) return
    this.updatePanelPosition()
    window.addEventListener('resize', this.handleViewportChange)
    window.addEventListener('scroll', this.handleViewportChange, true)
  }

  public closeMenu(): void {
    if (!this.isMenuOpen()) return
    this._isMenuOpen.set(false)
    this.activeAnchor = undefined
    window.removeEventListener('resize', this.handleViewportChange)
    window.removeEventListener('scroll', this.handleViewportChange, true)
  }

  public destroy(): void {
    this.closeMenu()
    this.mainButtonHost = undefined
  }

  private readonly handleViewportChange = (): void => {
    if (!this.isMenuOpen()) return
    this.updatePanelPosition()
  }

  private updatePanelPosition(): void {
    const anchor = this.activeAnchor ?? this.mainButtonHost
    if (!anchor) return

    const rect = anchor.getBoundingClientRect()
    const fixedContainingBlock = this.getFixedContainingBlock(anchor)
    const containingBlockRect = fixedContainingBlock?.getBoundingClientRect()
    const offsetTop = containingBlockRect?.top ?? 0
    const offsetLeft = containingBlockRect?.left ?? 0

    switch (this.direction()) {
    case 'top':
      this._panelTop.set(`${rect.top - offsetTop - this.panelOffset}px`)
      this._panelLeft.set(`${rect.left - offsetLeft}px`)
      break
    case 'bottom':
      this._panelTop.set(`${rect.bottom - offsetTop + this.panelOffset}px`)
      this._panelLeft.set(`${rect.left - offsetLeft}px`)
      break
    case 'left':
      this._panelTop.set(`${rect.top - offsetTop}px`)
      this._panelLeft.set(`${rect.left - offsetLeft - this.panelOffset}px`)
      break
    case 'right':
      this._panelTop.set(`${rect.top - offsetTop}px`)
      this._panelLeft.set(`${rect.right - offsetLeft + this.panelOffset}px`)
      break
    }
  }

  /**
   * Detecta el ancestro que actúa como containing block para elementos fixed.
   * Si existe (por transform/filter/contain/etc), el panel debe posicionarse
   * relativo a ese contenedor y no al viewport.
   */
  private getFixedContainingBlock(element: HTMLElement): HTMLElement | null {
    let current = element.parentElement
    while (current) {
      const styles = window.getComputedStyle(current)
      const hasTransformContext =
        styles.transform !== 'none' ||
        styles.perspective !== 'none' ||
        styles.filter !== 'none' ||
        (styles.backdropFilter && styles.backdropFilter !== 'none') ||
        styles.contain.includes('paint') ||
        styles.contain.includes('layout') ||
        styles.willChange.includes('transform') ||
        styles.willChange.includes('filter') ||
        styles.willChange.includes('perspective')

      if (hasTransformContext) {
        return current
      }
      current = current.parentElement
    }
    return null
  }
}

