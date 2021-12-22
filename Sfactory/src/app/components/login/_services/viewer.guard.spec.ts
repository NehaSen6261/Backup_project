import { TestBed } from '@angular/core/testing';

import { ViewerGuard } from './viewer.guard';

describe('ViewerGuard', () => {
  let guard: ViewerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ViewerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
