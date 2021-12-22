import { TestBed } from '@angular/core/testing';

import { PartservicesService } from './partservices.service';

describe('PartservicesService', () => {
  let service: PartservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
