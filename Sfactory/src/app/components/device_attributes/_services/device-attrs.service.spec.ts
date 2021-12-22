import { TestBed } from '@angular/core/testing';

import { DeviceAttrsService } from './device-attrs.service';

describe('DeviceAttrsService', () => {
  let service: DeviceAttrsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceAttrsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
