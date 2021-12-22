import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryControlpanelComponent } from './factory-controlpanel.component';

describe('FactoryControlpanelComponent', () => {
  let component: FactoryControlpanelComponent;
  let fixture: ComponentFixture<FactoryControlpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoryControlpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryControlpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
