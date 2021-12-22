import { TestBed } from '@angular/core/testing';

import { ControlroomGuard } from './controlroom.guard';

describe('ControlroomGuard', () => {
  let guard: ControlroomGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ControlroomGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
