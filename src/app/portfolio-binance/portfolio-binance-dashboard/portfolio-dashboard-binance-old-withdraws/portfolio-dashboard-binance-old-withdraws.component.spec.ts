import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBinanceOldWithdrawsComponent } from './portfolio-dashboard-binance-old-withdraws.component';

describe('PortfolioDashboardBinanceOldWithdrawsComponent', () => {
  let component: PortfolioDashboardBinanceOldWithdrawsComponent;
  let fixture: ComponentFixture<PortfolioDashboardBinanceOldWithdrawsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBinanceOldWithdrawsComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBinanceOldWithdrawsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
