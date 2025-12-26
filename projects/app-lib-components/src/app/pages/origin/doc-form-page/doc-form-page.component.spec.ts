import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocFormPageComponent } from './doc-form-page.component';

describe('DocFormPageComponent', () => {
  let component: DocFormPageComponent;
  let fixture: ComponentFixture<DocFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocFormPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
