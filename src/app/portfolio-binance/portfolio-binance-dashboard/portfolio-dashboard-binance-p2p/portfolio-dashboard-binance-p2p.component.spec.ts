import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBinanceP2pComponent } from './portfolio-dashboard-binance-p2p.component';

describe('PortfolioDashboardBinanceP2pComponent', () => {
  let component: PortfolioDashboardBinanceP2pComponent;
  let fixture: ComponentFixture<PortfolioDashboardBinanceP2pComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBinanceP2pComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBinanceP2pComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
