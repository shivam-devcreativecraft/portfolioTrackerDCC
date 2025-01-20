import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBinanceTotalStatsComponent } from './portfolio-dashboard-binance-total-stats.component';

describe('PortfolioDashboardBinanceTotalStatsComponent', () => {
  let component: PortfolioDashboardBinanceTotalStatsComponent;
  let fixture: ComponentFixture<PortfolioDashboardBinanceTotalStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBinanceTotalStatsComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBinanceTotalStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
