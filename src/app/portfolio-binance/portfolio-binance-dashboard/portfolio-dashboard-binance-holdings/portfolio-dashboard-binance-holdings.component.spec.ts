import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBinanceHoldingsComponent } from './portfolio-dashboard-binance-holdings.component';

describe('PortfolioDashboardBinanceHoldingsComponent', () => {
  let component: PortfolioDashboardBinanceHoldingsComponent;
  let fixture: ComponentFixture<PortfolioDashboardBinanceHoldingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBinanceHoldingsComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBinanceHoldingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
