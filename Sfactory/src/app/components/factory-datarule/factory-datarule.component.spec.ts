import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryDataruleComponent } from './factory-datarule.component';

describe('FactoryDataruleComponent', () => {
  let component: FactoryDataruleComponent;
  let fixture: ComponentFixture<FactoryDataruleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoryDataruleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryDataruleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
