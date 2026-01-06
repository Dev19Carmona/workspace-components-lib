import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocEditableTableNgPageComponent } from './doc-editable-table-ng-page.component';

describe('DocEditableTableNgPageComponent', () => {
  let component: DocEditableTableNgPageComponent;
  let fixture: ComponentFixture<DocEditableTableNgPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocEditableTableNgPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocEditableTableNgPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

