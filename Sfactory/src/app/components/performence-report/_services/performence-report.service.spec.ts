import { TestBed } from '@angular/core/testing';

import { PerformenceReportService } from './performence-report.service';

describe('PerformenceReportService', () => {
  let service: PerformenceReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerformenceReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
