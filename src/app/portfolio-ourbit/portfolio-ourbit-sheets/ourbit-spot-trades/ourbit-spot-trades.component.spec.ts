import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurbitSpotTradesComponent } from './ourbit-spot-trades.component';

describe('OurbitSpotTradesComponent', () => {
  let component: OurbitSpotTradesComponent;
  let fixture: ComponentFixture<OurbitSpotTradesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurbitSpotTradesComponent]
    });
    fixture = TestBed.createComponent(OurbitSpotTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
