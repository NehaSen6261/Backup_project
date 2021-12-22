import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformenceReportComponent } from './performence-report.component';

describe('PerformenceReportComponent', () => {
  let component: PerformenceReportComponent;
  let fixture: ComponentFixture<PerformenceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformenceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformenceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
