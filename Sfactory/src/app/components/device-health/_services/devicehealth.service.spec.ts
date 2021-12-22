import { TestBed } from '@angular/core/testing';

import { DevicehealthService } from './devicehealth.service';

describe('DevicehealthService', () => {
  let service: DevicehealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevicehealthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
