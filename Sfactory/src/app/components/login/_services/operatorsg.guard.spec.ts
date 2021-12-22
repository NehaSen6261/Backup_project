import { TestBed } from '@angular/core/testing';

import { OperatorsgGuard } from './operatorsg.guard';

describe('OperatorsgGuard', () => {
  let guard: OperatorsgGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OperatorsgGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
