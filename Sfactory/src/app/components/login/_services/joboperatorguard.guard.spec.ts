import { TestBed } from '@angular/core/testing';

import { JoboperatorguardGuard } from './joboperatorguard.guard';

describe('JoboperatorguardGuard', () => {
  let guard: JoboperatorguardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(JoboperatorguardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
