import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardMexcTotalStatsComponent } from './portfolio-dashboard-mexc-total-stats.component';

describe('PortfolioDashboardMexcTotalStatsComponent', () => {
  let component: PortfolioDashboardMexcTotalStatsComponent;
  let fixture: ComponentFixture<PortfolioDashboardMexcTotalStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardMexcTotalStatsComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardMexcTotalStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
