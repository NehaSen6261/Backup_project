import { TestBed } from '@angular/core/testing';

import { FactoryCtrlpanelService } from './factory-ctrlpanel.service';

describe('FactoryCtrlpanelService', () => {
  let service: FactoryCtrlpanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactoryCtrlpanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
