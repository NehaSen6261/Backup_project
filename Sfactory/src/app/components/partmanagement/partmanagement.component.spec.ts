import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartmanagementComponent } from './partmanagement.component';

describe('PartmanagementComponent', () => {
  let component: PartmanagementComponent;
  let fixture: ComponentFixture<PartmanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartmanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
