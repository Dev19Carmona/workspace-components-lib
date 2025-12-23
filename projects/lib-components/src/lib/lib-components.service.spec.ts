import { TestBed } from '@angular/core/testing';

import { LibComponentsService } from './lib-components.service';

describe('LibComponentsService', () => {
  let service: LibComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
