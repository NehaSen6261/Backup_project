import { TestBed } from '@angular/core/testing';

import { SubtenantAdmAuthGaurdService } from './subtenant-adm-auth-gaurd.service';

describe('SubtenantAdmAuthGaurdService', () => {
  let service: SubtenantAdmAuthGaurdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubtenantAdmAuthGaurdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
