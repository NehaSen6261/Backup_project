import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtenantComponent } from './subtenant.component';

describe('SubtenantComponent', () => {
  let component: SubtenantComponent;
  let fixture: ComponentFixture<SubtenantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtenantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
