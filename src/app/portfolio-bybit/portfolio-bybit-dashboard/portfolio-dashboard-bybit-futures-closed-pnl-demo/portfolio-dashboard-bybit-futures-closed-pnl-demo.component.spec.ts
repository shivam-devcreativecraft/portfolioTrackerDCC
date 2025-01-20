import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBybitFuturesClosedPnlDemoComponent } from './portfolio-dashboard-bybit-futures-closed-pnl-demo.component';

describe('PortfolioDashboardBybitFuturesClosedPnlDemoComponent', () => {
  let component: PortfolioDashboardBybitFuturesClosedPnlDemoComponent;
  let fixture: ComponentFixture<PortfolioDashboardBybitFuturesClosedPnlDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBybitFuturesClosedPnlDemoComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBybitFuturesClosedPnlDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
