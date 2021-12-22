import { TestBed } from '@angular/core/testing';

import { AccountActivationService } from './account-activation.service';

describe('AccountActivationService', () => {
  let service: AccountActivationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountActivationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
