import { TestBed } from '@angular/core/testing';

import { TenantAdnVwrAuthGaurdService } from './tenant-adn-vwr-auth-gaurd.service';

describe('TenantAdnVwrAuthGaurdService', () => {
  let service: TenantAdnVwrAuthGaurdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantAdnVwrAuthGaurdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
