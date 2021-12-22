import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatarulesComponent } from './datarules.component';

describe('DatarulesComponent', () => {
  let component: DatarulesComponent;
  let fixture: ComponentFixture<DatarulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatarulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatarulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
