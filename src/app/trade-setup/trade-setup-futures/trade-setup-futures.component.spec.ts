import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeSetupFuturesComponent } from './trade-setup-futures.component';

describe('TradeSetupFuturesComponent', () => {
  let component: TradeSetupFuturesComponent;
  let fixture: ComponentFixture<TradeSetupFuturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradeSetupFuturesComponent]
    });
    fixture = TestBed.createComponent(TradeSetupFuturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
