import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBinanceWithdrawCryptoComponent } from './portfolio-dashboard-binance-withdraw-crypto.component';

describe('PortfolioDashboardBinanceWithdrawCryptoComponent', () => {
  let component: PortfolioDashboardBinanceWithdrawCryptoComponent;
  let fixture: ComponentFixture<PortfolioDashboardBinanceWithdrawCryptoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBinanceWithdrawCryptoComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBinanceWithdrawCryptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
