import { TestBed } from '@angular/core/testing';

import { DatalogsService } from './datalogs.service';

describe('DatalogsService', () => {
  let service: DatalogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatalogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
