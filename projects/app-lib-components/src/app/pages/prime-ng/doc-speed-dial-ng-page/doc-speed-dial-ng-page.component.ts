import { Component } from '@angular/core';
import { SpeedDialNgComponent } from 'lib-components';

@Component({
  selector: 'app-doc-speed-dial-ng-page',
  imports: [SpeedDialNgComponent],
  templateUrl: './doc-speed-dial-ng-page.component.html',
  styleUrl: './doc-speed-dial-ng-page.component.scss'
})
export class DocSpeedDialNgPageComponent {
  readonly basicSpeedDialConfig = {
    items: [
      { icon: 'pi pi-pencil', tooltipOptions: { tooltipLabel: 'Editar' } },
      { icon: 'pi pi-upload', tooltipOptions: { tooltipLabel: 'Subir' } },
      { icon: 'pi pi-trash', tooltipOptions: { tooltipLabel: 'Eliminar' } }
    ],
    style: { right: '1rem', bottom: '1rem' }
  };

  readonly directionUpConfig = {
    items: [
      { icon: 'pi pi-copy', tooltipOptions: { tooltipLabel: 'Copiar' } },
      { icon: 'pi pi-clone', tooltipOptions: { tooltipLabel: 'Duplicar' } },
      { icon: 'pi pi-save', tooltipOptions: { tooltipLabel: 'Guardar' } }
    ],
    direction: 'up' as const,
    style: { right: '1rem', bottom: '1rem' }
  };

  readonly directionLeftConfig = {
    items: [
      { icon: 'pi pi-play', tooltipOptions: { tooltipLabel: 'Play' } },
      { icon: 'pi pi-pause', tooltipOptions: { tooltipLabel: 'Pause' } },
      { icon: 'pi pi-stop', tooltipOptions: { tooltipLabel: 'Stop' } }
    ],
    direction: 'left' as const,
    style: { right: '1rem', bottom: '1rem' }
  };

  readonly customButtonConfig = {
    items: [
      { icon: 'pi pi-file-pdf', tooltipOptions: { tooltipLabel: 'Exportar PDF' } },
      { icon: 'pi pi-file-excel', tooltipOptions: { tooltipLabel: 'Exportar Excel' } },
      { icon: 'pi pi-send', tooltipOptions: { tooltipLabel: 'Compartir' } }
    ],
    buttonProps: {
      icon: 'pi pi-cog',
      severity: 'contrast' as const,
      rounded: true
    },
    style: { right: '1rem', bottom: '1rem' }
  };

  readonly tooltipBottomConfig = {
    items: [
      { icon: 'pi pi-whatsapp', tooltipOptions: { tooltipLabel: 'WhatsApp' } },
      { icon: 'pi pi-envelope', tooltipOptions: { tooltipLabel: 'Email' } },
      { icon: 'pi pi-phone', tooltipOptions: { tooltipLabel: 'Llamar' } }
    ],
    tooltipOptions: { tooltipPosition: 'bottom' as const },
    style: { right: '1rem', bottom: '1rem' }
  };
}
