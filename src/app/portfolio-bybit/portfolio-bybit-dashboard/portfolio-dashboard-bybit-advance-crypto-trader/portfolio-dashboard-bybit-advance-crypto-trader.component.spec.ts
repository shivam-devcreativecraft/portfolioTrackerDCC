import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBybitAdvanceCryptoTraderComponent } from './portfolio-dashboard-bybit-advance-crypto-trader.component';

describe('PortfolioDashboardBybitAdvanceCryptoTraderComponent', () => {
  let component: PortfolioDashboardBybitAdvanceCryptoTraderComponent;
  let fixture: ComponentFixture<PortfolioDashboardBybitAdvanceCryptoTraderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBybitAdvanceCryptoTraderComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBybitAdvanceCryptoTraderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
