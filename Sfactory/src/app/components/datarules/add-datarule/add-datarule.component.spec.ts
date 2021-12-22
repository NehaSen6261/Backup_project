import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDataruleComponent } from './add-datarule.component';

describe('AddDataruleComponent', () => {
  let component: AddDataruleComponent;
  let fixture: ComponentFixture<AddDataruleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDataruleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDataruleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
