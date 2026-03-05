import { Component, inject, input, OnInit } from '@angular/core';
import { ISpeedDialNgConfig, ISpeedDialNgDirection, ISpeedDialNgItem } from './interfaces';
import { SpeedDialNgService } from './speed-dial-ng.service';
import { SpeedDialModule } from 'primeng/speeddial';
import { ButtonProps } from 'primeng/button';
import { TooltipOptions } from 'primeng/api';

@Component({
  selector: 'lib-speed-dial-ng',
  imports: [SpeedDialModule],
  templateUrl: './speed-dial-ng.component.html',
  styleUrl: './speed-dial-ng.component.css',
  providers: [SpeedDialNgService]
})
export class SpeedDialNgComponent implements OnInit{
  private readonly speedDialNgService = inject(SpeedDialNgService)
  readonly configInput = input.required<ISpeedDialNgConfig>()


  constructor() {
  }

  ngOnInit(): void {
    this.speedDialNgService.setConfig(this.configInput())
  }

  get config(): ISpeedDialNgConfig {
    return this.speedDialNgService.config()
  }

  get items(): ISpeedDialNgItem[] {
    return this.speedDialNgService.items()
  }

  get buttonProps(): ButtonProps {
    return this.speedDialNgService.buttonProps()
  }

  get tooltipOptions(): TooltipOptions {
    return this.speedDialNgService.tooltipOptions()
  }

  get style(): Record<string, string> {
    return this.speedDialNgService.style()
  }

  get direction(): ISpeedDialNgDirection {
    return this.speedDialNgService.direction()
  }
}
