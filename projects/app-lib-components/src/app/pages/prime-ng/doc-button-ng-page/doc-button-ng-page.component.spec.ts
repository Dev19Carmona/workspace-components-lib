import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocButtonNgPageComponent } from './doc-button-ng-page.component';

describe('DocButtonNgPageComponent', () => {
  let component: DocButtonNgPageComponent;
  let fixture: ComponentFixture<DocButtonNgPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocButtonNgPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocButtonNgPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
