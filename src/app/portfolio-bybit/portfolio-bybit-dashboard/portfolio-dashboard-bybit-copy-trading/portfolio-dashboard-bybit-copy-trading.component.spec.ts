import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBybitCopyTradingComponent } from './portfolio-dashboard-bybit-copy-trading.component';

describe('PortfolioDashboardBybitCopyTradingComponent', () => {
  let component: PortfolioDashboardBybitCopyTradingComponent;
  let fixture: ComponentFixture<PortfolioDashboardBybitCopyTradingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBybitCopyTradingComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBybitCopyTradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
