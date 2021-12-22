import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantdashboardComponent } from './plantdashboard.component';

describe('PlantdashboardComponent', () => {
  let component: PlantdashboardComponent;
  let fixture: ComponentFixture<PlantdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
