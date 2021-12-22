import { TestBed } from '@angular/core/testing';

import { PlantdashboardGuard } from './plantdashboard.guard';

describe('PlantdashboardGuard', () => {
  let guard: PlantdashboardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PlantdashboardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
