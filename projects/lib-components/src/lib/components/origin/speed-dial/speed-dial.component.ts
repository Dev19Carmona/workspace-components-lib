import type { AfterViewInit, ElementRef, OnDestroy } from '@angular/core'
import { Component, effect, inject, input, ViewChild } from '@angular/core'
import { SpeedDialService } from './services/speed-dial.service'
import type { ISpeedDialConfig, TSpeedDialDirection } from './interfaces'
import type { IButtonConfig} from 'ln-20-lib-components'
import { ButtonNgComponent } from 'ln-20-lib-components'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-speed-dial',
  imports: [ButtonNgComponent, CommonModule],
  templateUrl: './speed-dial.component.html',
  styleUrl: './speed-dial.component.scss',
  providers: [SpeedDialService]
})
export class SpeedDialComponent implements AfterViewInit, OnDestroy{
  @ViewChild('mainButtonContainer')
  private mainButtonContainer?: ElementRef<HTMLElement>

  speedDialConfig = input.required<ISpeedDialConfig>()
  private readonly speedDialService = inject(SpeedDialService)

  constructor() {
    effect(() => {
      this.speedDialService.setSpeedDialConfig(this.speedDialConfig())
    })
  }

  get buttons(): IButtonConfig[] {
    return this.speedDialService.buttons()
  }

  get overlayButtons(): IButtonConfig[] {
    return this.speedDialService.overlayButtons()
  }

  get mainButton(): IButtonConfig {
    return this.speedDialService.mainButton()
  }

  get isMenuOpen(): boolean {
    return this.speedDialService.isMenuOpen()
  }

  get panelTop(): string {
    return this.speedDialService.panelTop()
  }

  get panelLeft(): string {
    return this.speedDialService.panelLeft()
  }

  get direction(): TSpeedDialDirection {
    return this.speedDialService.direction()
  }

  ngAfterViewInit(): void {
    const hostElement = this.mainButtonContainer?.nativeElement
    if (!hostElement) return
    this.speedDialService.setMainButtonHost(hostElement)
  }

  ngOnDestroy(): void {
    this.speedDialService.destroy()
  }

  closeMenu(): void {
    this.speedDialService.closeMenu()
  }

  onMainButtonClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null
    const anchor = target?.closest('button,[role="button"]') as HTMLElement | null
    this.speedDialService.toggleMenu(anchor ?? this.mainButtonContainer?.nativeElement)
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation()
  }
}
