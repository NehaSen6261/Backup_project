import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDataruleComponent } from './view-datarule.component';

describe('ViewDataruleComponent', () => {
  let component: ViewDataruleComponent;
  let fixture: ComponentFixture<ViewDataruleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDataruleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDataruleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
