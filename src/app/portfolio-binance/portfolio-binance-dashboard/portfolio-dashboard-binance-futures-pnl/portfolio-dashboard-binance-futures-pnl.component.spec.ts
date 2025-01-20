import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBinanceFuturesPnlComponent } from './portfolio-dashboard-binance-futures-pnl.component';

describe('PortfolioDashboardBinanceFuturesPnlComponent', () => {
  let component: PortfolioDashboardBinanceFuturesPnlComponent;
  let fixture: ComponentFixture<PortfolioDashboardBinanceFuturesPnlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBinanceFuturesPnlComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBinanceFuturesPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
