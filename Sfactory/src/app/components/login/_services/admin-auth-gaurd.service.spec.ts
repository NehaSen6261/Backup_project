import { TestBed } from '@angular/core/testing';

import { TenantAdminAuthGaurd } from './admin-auth-gaurd.service';

describe('TenantAdminAuthGaurd', () => {
  let service: TenantAdminAuthGaurd;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantAdminAuthGaurd);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
