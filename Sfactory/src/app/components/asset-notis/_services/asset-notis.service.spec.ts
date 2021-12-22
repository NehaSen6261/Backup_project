import { TestBed } from '@angular/core/testing';

import { AssetNotisService } from './asset-notis.service';

describe('AssetNotisService', () => {
  let service: AssetNotisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetNotisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
