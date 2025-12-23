import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibComponentsComponent } from './lib-components.component';

describe('LibComponentsComponent', () => {
  let component: LibComponentsComponent;
  let fixture: ComponentFixture<LibComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibComponentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
