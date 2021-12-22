import { TestBed } from '@angular/core/testing';

import { FactorycustomersService } from './factorycustomers.service';

describe('FactorycustomersService', () => {
  let service: FactorycustomersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactorycustomersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
