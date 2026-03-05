import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocSpeedDialNgPageComponent } from './doc-speed-dial-ng-page.component';

describe('DocSpeedDialNgPageComponent', () => {
  let component: DocSpeedDialNgPageComponent;
  let fixture: ComponentFixture<DocSpeedDialNgPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocSpeedDialNgPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocSpeedDialNgPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
