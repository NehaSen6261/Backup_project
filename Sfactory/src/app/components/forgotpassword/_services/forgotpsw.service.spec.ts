import { TestBed } from '@angular/core/testing';

import { ForgotpswService } from './forgotpsw.service';

describe('ForgotpswService', () => {
  let service: ForgotpswService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForgotpswService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
