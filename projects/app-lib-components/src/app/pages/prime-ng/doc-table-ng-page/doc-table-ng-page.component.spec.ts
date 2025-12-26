import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocTableNgPageComponent } from './doc-table-ng-page.component';

describe('DocTableNgPageComponent', () => {
  let component: DocTableNgPageComponent;
  let fixture: ComponentFixture<DocTableNgPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocTableNgPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocTableNgPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
