import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetNotisComponent } from './asset-notis.component';

describe('AssetNotisComponent', () => {
  let component: AssetNotisComponent;
  let fixture: ComponentFixture<AssetNotisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetNotisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetNotisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
