import type { Signal, OnDestroy, WritableSignal, OnInit, QueryList } from '@angular/core'
import { ChangeDetectionStrategy, Component, computed, effect, forwardRef, input, model, output, signal, ContentChildren } from '@angular/core'
import { FormsModule, NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { DatePickerModule } from 'primeng/datepicker'
import { InputTextModule } from 'primeng/inputtext'
import { MultiSelectModule } from 'primeng/multiselect'
import { SelectModule } from 'primeng/select'
import { ETypeInput } from '../../enums'
import type { IKnobConfig, InlineControlConfig } from './interfaces/index'
import { InputMaskModule } from 'primeng/inputmask'
import { InputNumberModule } from 'primeng/inputnumber'
import { InputOtpModule } from 'primeng/inputotp'
import { KnobModule } from 'primeng/knob'
import { TextareaModule } from 'primeng/textarea'
import { ChipModule } from 'primeng/chip'
import { CommonModule } from '@angular/common'
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { debounceTime, distinctUntilChanged } from 'rxjs'
import type { PrimeTemplate as PrimeTemplateType } from 'primeng/api'
import { PrimeTemplate } from 'primeng/api'
import { IPrimeNgSelection } from '../../../../prime-ng/interfaces'

@Component({
  selector: 'lib-inline-input',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    MultiSelectModule,
    InputMaskModule,
    InputNumberModule,
    InputOtpModule,
    KnobModule,
    TextareaModule,
    ChipModule,
    CommonModule
  ],
  templateUrl: './inline-input.component.html',
  styleUrl: './inline-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InlineInputComponent),
      multi: true
    }
  ]
})
export class InlineInputComponent<T = string | number | boolean | null> implements ControlValueAccessor, OnDestroy, OnInit {
  config = input<InlineControlConfig>({ typeInput: ETypeInput.TEXT })
  value = model<T | null>(null)
  outputValue = output<T>()
  outputBlur = output<T>()
  outputDebounced = output<T>()

  // Capturar templates proyectados desde el componente padre
  @ContentChildren(PrimeTemplate) templates!: QueryList<PrimeTemplateType>

  // Para el manejo de chips
  chips: string[] = []
  currentInput = ''
  showDuplicateMessage = false
  duplicateChips: string[] = []
  duplicateMessageTimer: ReturnType<typeof setTimeout> | null = null

  constructor() {
    effect(() => {
      this.outputValue.emit(this.value() as T)
    })

    const value$ = toObservable(this.value)
    value$
      .pipe(
        debounceTime(300),          // <- adjust ms here
        distinctUntilChanged(),     // avoid repeats for same value
        takeUntilDestroyed()        // auto-cleanup on destroy
      )
      .subscribe(v => this.outputDebounced.emit(v as T))

    effect(() => {
      this.valueSelect.update((_prev) => {
        const options = this.config()?.selectConfig?.options
        const currentValue = this.value()
        if (this.isSelection(currentValue)) return currentValue
        if (currentValue === null || currentValue === undefined) return undefined
        return options?.find(option => option.code === currentValue)
      })
    })
  }

  ngOnInit(): void {
  }

  onChange: (value: any) => void = () => { }
  onTouched: () => void = () => { }

  writeValue(value: string | number | boolean | null): void {
    this.value.set(value as T)
    // Si es tipo CHIPS, inicializar los chips desde el valor
    if (this.type === ETypeInput.CHIPS && typeof value === 'string') {
      this.chips = value ? value.split(' ').filter(chip => chip.trim() !== '') : []
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  onChangeValue(value: string | number | boolean | null | IPrimeNgSelection<string | boolean>) {
    this.value.set(value as T)
    this.onChange(value)
  }

  onBlur() {
    this.onTouched()
    this.outputBlur.emit(this.value() as T)
  }

  /**
   * Maneja eventos de teclado para prevenir la navegación de PrimeNG Table
   * cuando se usan las flechas izquierda/derecha dentro del input
   */
  onKeyDown(event: KeyboardEvent): void {
    // Verificar si son teclas de flecha izquierda o derecha
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      // Detener la propagación del evento hacia el table
      event.stopPropagation()
    }
  }

  private isSelection(value: unknown): value is IPrimeNgSelection<string | boolean> {
    return !!value && typeof value === 'object' && 'code' in (value as Record<string, unknown>) && 'name' in (value as Record<string, unknown>)
  }

  valueSelect: WritableSignal<IPrimeNgSelection<string | boolean> | undefined> = signal<IPrimeNgSelection<string | boolean> | undefined>(undefined)
  public setValueSelect(value: IPrimeNgSelection<string | boolean> | undefined) {
    this.valueSelect.set(value)
  }

  get type(): ETypeInput {
    return this.config()?.typeInput ?? ETypeInput.TEXT
  }

  get ETypeInput(): typeof ETypeInput {
    return ETypeInput
  }

  get duplicatesText(): string {
    return this.duplicateChips.join(', ')
  }

  get currency(): string {
    return this.config()?.currencyConfig?.currency ?? 'COP'
  }

  get locale(): string {
    return this.config()?.currencyConfig?.locale ?? 'es-CO'
  }

  get minFractionDigits(): number {
    return this.config()?.currencyConfig?.minFractionDigits ?? 2
  }

  get maxFractionDigits(): number {
    return this.config()?.currencyConfig?.maxFractionDigits ?? 2
  }

  protected knobValueInput: Signal<number> = computed(() => {
    let response: number = this.value() as number
    const knobConfig: IKnobConfig = this.config()?.knobConfig ?? { min: 0, max: 100, step: 1 }
    response = parseInt(this.value() as string) ?? 0
    if (response < (knobConfig?.min ?? 0)) {
      response = knobConfig.min ?? 0
    }
    if (response > (knobConfig?.max ?? 100)) {
      response = knobConfig.max ?? 100
    }
    return response
  })

  protected knobValueTemplate: Signal<string> = computed(() => {
    return this.config()?.knobConfig?.valueTemplate ?? ''
  })

  // Métodos para manejo de chips
  onChipInputChange(event: Event): void {
    const target = event.target as HTMLInputElement
    this.currentInput = target.value
  }

  onChipKeydown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      this.addChip()
    } else if (event.key === 'Backspace' && this.currentInput === '' && this.chips.length > 0) {
      // Si no hay texto y hay chips, eliminar el último chip
      this.removeChip(this.chips.length - 1)
    }
    // No interceptar las flechas aquí ya que se maneja en onKeyDown
  }

  onChipPaste(event: ClipboardEvent): void {
    event.preventDefault()
    const pastedText = event.clipboardData?.getData('text') || ''
    this.processPastedText(pastedText)
  }

  addChip(): void {
    const trimmedValue = this.currentInput.trim()
    if (trimmedValue) {
      if (this.chips.includes(trimmedValue)) {
        // Mostrar mensaje de duplicado con el chip específico
        this.duplicateChips = [trimmedValue]
        this.showDuplicateAlert()
      } else {
        this.chips.push(trimmedValue)
        this.currentInput = ''
        this.updateChipsValue()
        this.hideDuplicateAlert()
      }
    }
  }

  removeChip(index: number): void {
    this.chips.splice(index, 1)
    this.updateChipsValue()
  }

  private updateChipsValue(): void {
    const chipsValue = this.chips.join(' ')
    this.value.set(chipsValue as T)
    this.onChange(chipsValue)
  }

  private showDuplicateAlert(): void {
    this.showDuplicateMessage = true
    // Limpiar timer anterior si existe
    if (this.duplicateMessageTimer) {
      clearTimeout(this.duplicateMessageTimer)
    }
    // Ocultar mensaje después de 3 segundos
    this.duplicateMessageTimer = setTimeout(() => {
      this.hideDuplicateAlert()
    }, 3000)
  }

  private hideDuplicateAlert(): void {
    this.showDuplicateMessage = false
    this.duplicateChips = []
    if (this.duplicateMessageTimer) {
      clearTimeout(this.duplicateMessageTimer)
      this.duplicateMessageTimer = null
    }
  }

  private processPastedText(text: string): void {
    // Dividir el texto por espacios y filtrar elementos vacíos
    const newChips = text
      .split(/\s+/) // Dividir por uno o más espacios
      .map(chip => chip.trim()) // Limpiar espacios en cada elemento
      .filter(chip => chip !== '') // Filtrar elementos vacíos

    const foundDuplicates: string[] = []
    let addedChips = 0

    // Agregar cada chip nuevo y recopilar duplicados
    newChips.forEach(chipText => {
      if (!this.chips.includes(chipText)) {
        this.chips.push(chipText)
        addedChips++
      } else {
        // Solo agregar a duplicados si no está ya en la lista
        if (!foundDuplicates.includes(chipText)) {
          foundDuplicates.push(chipText)
        }
      }
    })

    // Limpiar el input actual
    this.currentInput = ''

    // Actualizar el valor si se agregaron chips
    if (addedChips > 0) {
      this.updateChipsValue()
    }

    // Mostrar alerta si hubo duplicados
    if (foundDuplicates.length > 0) {
      this.duplicateChips = foundDuplicates
      this.showDuplicateAlert()
    } else {
      this.hideDuplicateAlert()
    }
  }

  /**
   * Método público para establecer chips desde un array externo
   * @param chipsArray Array de strings que representan las chips
   */
  setChipsFromArray(chipsArray: string[]): void {
    if (!Array.isArray(chipsArray)) {
      console.warn('setChipsFromArray: El parámetro debe ser un array de strings')
      return
    }

    // Filtrar elementos válidos (strings no vacíos)
    const validChips = chipsArray
      .filter(chip => typeof chip === 'string' && chip.trim() !== '')
      .map(chip => chip.trim())

    // Actualizar el array de chips
    this.chips = [...validChips]

    // Limpiar el input actual
    this.currentInput = ''

    // Actualizar el valor del componente
    this.updateChipsValue()

    // Ocultar cualquier mensaje de duplicado
    this.hideDuplicateAlert()
  }

  /**
   * Método público para obtener las chips actuales como array
   * @returns Array de strings con las chips actuales
   */
  getChipsAsArray(): string[] {
    return [...this.chips]
  }

  /**
   * Método público para limpiar todas las chips
   */
  clearAllChips(): void {
    this.chips = []
    this.currentInput = ''
    this.updateChipsValue()
    this.hideDuplicateAlert()
  }

  /**
   * Método público para agregar múltiples chips desde un array
   * Evita duplicados y muestra mensajes de alerta si es necesario
   * @param chipsArray Array de strings a agregar
   */
  addChipsFromArray(chipsArray: string[]): void {
    if (!Array.isArray(chipsArray)) {
      console.warn('addChipsFromArray: El parámetro debe ser un array de strings')
      return
    }

    // Filtrar elementos válidos
    const validChips = chipsArray
      .filter(chip => typeof chip === 'string' && chip.trim() !== '')
      .map(chip => chip.trim())

    const foundDuplicates: string[] = []
    let addedChips = 0

    // Agregar cada chip nuevo y recopilar duplicados
    validChips.forEach(chipText => {
      if (!this.chips.includes(chipText)) {
        this.chips.push(chipText)
        addedChips++
      } else {
        // Solo agregar a duplicados si no está ya en la lista
        if (!foundDuplicates.includes(chipText)) {
          foundDuplicates.push(chipText)
        }
      }
    })

    // Actualizar el valor si se agregaron chips
    if (addedChips > 0) {
      this.updateChipsValue()
    }

    // Mostrar alerta si hubo duplicados
    if (foundDuplicates.length > 0) {
      this.duplicateChips = foundDuplicates
      this.showDuplicateAlert()
    } else {
      this.hideDuplicateAlert()
    }
  }

  // Limpiar timer al destruir el componente
  ngOnDestroy(): void {
    if (this.duplicateMessageTimer) {
      clearTimeout(this.duplicateMessageTimer)
    }
  }


}


