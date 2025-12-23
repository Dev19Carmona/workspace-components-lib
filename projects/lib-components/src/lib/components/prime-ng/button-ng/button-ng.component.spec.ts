import type { ComponentFixture} from '@angular/core/testing'
import { TestBed } from '@angular/core/testing'

import { ButtonNgComponent } from './button-ng.component'

describe('ButtonNgComponent', () => {
  let component: ButtonNgComponent
  let fixture: ComponentFixture<ButtonNgComponent>

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [ButtonNgComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(ButtonNgComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
