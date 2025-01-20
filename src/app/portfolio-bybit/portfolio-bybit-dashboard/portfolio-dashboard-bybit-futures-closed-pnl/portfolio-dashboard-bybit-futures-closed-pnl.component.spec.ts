import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBybitFuturesClosedPnlComponent } from './portfolio-dashboard-bybit-futures-closed-pnl.component';

describe('PortfolioDashboardBybitFuturesClosedPnlComponent', () => {
  let component: PortfolioDashboardBybitFuturesClosedPnlComponent;
  let fixture: ComponentFixture<PortfolioDashboardBybitFuturesClosedPnlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBybitFuturesClosedPnlComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBybitFuturesClosedPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
