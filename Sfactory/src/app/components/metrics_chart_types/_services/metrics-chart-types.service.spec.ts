import { TestBed } from '@angular/core/testing';

import { MetricsChartTypesService } from './metrics-chart-types.service';

describe('MetricsChartTypesService', () => {
  let service: MetricsChartTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricsChartTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
