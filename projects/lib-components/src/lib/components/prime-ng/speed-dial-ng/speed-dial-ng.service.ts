import { computed, Injectable, input, Signal, signal, WritableSignal } from '@angular/core';
import { ISpeedDialNgConfig, ISpeedDialNgDirection, ISpeedDialNgItem } from './interfaces';
import { ButtonProps } from 'primeng/button';
import { TooltipOptions } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SpeedDialNgService {

  constructor() { }

  private _config: WritableSignal<ISpeedDialNgConfig> = signal<ISpeedDialNgConfig>({} as ISpeedDialNgConfig)
  public config = this._config.asReadonly()
  public items: Signal<ISpeedDialNgItem[]> = computed(() => this.config().items)
  public buttonProps: Signal<ButtonProps> = computed(() => this.config().buttonProps ?? {severity: 'primary', rounded: true})
  public tooltipOptions: Signal<TooltipOptions> = computed(() => this.config().tooltipOptions ?? { tooltipPosition: 'top' })
  public style: Signal<Record<string, string>> = computed(() => this.config().style ?? {})
  public direction: Signal<ISpeedDialNgDirection> = computed(() => this.config().direction ?? 'down')
  setConfig(value: ISpeedDialNgConfig) {
    this._config.set(value)
  }
}
