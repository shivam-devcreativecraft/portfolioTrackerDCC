import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBinanceFuturesTradeComponent } from './portfolio-dashboard-binance-futures-trade.component';

describe('PortfolioDashboardBinanceFuturesTradeComponent', () => {
  let component: PortfolioDashboardBinanceFuturesTradeComponent;
  let fixture: ComponentFixture<PortfolioDashboardBinanceFuturesTradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBinanceFuturesTradeComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBinanceFuturesTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
