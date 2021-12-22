import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisDetailedViewComponent } from './analysis-detailed-view.component';

describe('AnalysisDetailedViewComponent', () => {
  let component: AnalysisDetailedViewComponent;
  let fixture: ComponentFixture<AnalysisDetailedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysisDetailedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisDetailedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
