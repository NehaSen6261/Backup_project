import { TestBed } from '@angular/core/testing';

import { PlantdashboardService } from './plantdashboard.service';

describe('PlantdashboardService', () => {
  let service: PlantdashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantdashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
