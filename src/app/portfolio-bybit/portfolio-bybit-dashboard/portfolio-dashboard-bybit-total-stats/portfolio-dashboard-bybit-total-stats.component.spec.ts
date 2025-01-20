import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBybitTotalStatsComponent } from './portfolio-dashboard-bybit-total-stats.component';

describe('PortfolioDashboardBybitTotalStatsComponent', () => {
  let component: PortfolioDashboardBybitTotalStatsComponent;
  let fixture: ComponentFixture<PortfolioDashboardBybitTotalStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBybitTotalStatsComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBybitTotalStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
