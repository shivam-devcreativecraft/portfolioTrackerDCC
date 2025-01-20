import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeSetupSpotComponent } from './trade-setup-spot.component';

describe('TradeSetupSpotComponent', () => {
  let component: TradeSetupSpotComponent;
  let fixture: ComponentFixture<TradeSetupSpotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradeSetupSpotComponent]
    });
    fixture = TestBed.createComponent(TradeSetupSpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
