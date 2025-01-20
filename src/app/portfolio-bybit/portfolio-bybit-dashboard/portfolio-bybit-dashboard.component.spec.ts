import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioBybitDashboardComponent } from './portfolio-bybit-dashboard.component';

describe('PortfolioBybitDashboardComponent', () => {
  let component: PortfolioBybitDashboardComponent;
  let fixture: ComponentFixture<PortfolioBybitDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioBybitDashboardComponent]
    });
    fixture = TestBed.createComponent(PortfolioBybitDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
