import { TestBed } from '@angular/core/testing';

import { FactrydruleService } from './factrydrule.service';

describe('FactrydruleService', () => {
  let service: FactrydruleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactrydruleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
