import { TestBed } from '@angular/core/testing';

import { DataruleService } from './datarule.service';

describe('DataruleService', () => {
  let service: DataruleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataruleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
