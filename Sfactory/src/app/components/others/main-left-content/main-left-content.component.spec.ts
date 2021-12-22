import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLeftContentComponent } from './main-left-content.component';

describe('MainLeftContentComponent', () => {
  let component: MainLeftContentComponent;
  let fixture: ComponentFixture<MainLeftContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainLeftContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainLeftContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
