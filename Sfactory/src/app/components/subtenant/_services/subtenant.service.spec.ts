import { TestBed } from '@angular/core/testing';

import { SubtenantService } from './subtenant.service';

describe('SubtenantService', () => {
  let service: SubtenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubtenantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
