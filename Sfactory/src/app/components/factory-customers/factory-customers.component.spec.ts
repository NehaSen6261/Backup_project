import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryCustomersComponent } from './factory-customers.component';

describe('FactoryCustomersComponent', () => {
  let component: FactoryCustomersComponent;
  let fixture: ComponentFixture<FactoryCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoryCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
