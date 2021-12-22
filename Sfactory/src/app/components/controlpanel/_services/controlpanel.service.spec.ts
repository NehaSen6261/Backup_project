import { TestBed } from '@angular/core/testing';

import { ControlpanelService } from './controlpanel.service';

describe('ControlpanelService', () => {
  let service: ControlpanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlpanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
