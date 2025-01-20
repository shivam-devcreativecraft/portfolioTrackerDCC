import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioOurbitDashboardComponent } from './portfolio-ourbit-dashboard.component';

describe('PortfolioOurbitDashboardComponent', () => {
  let component: PortfolioOurbitDashboardComponent;
  let fixture: ComponentFixture<PortfolioOurbitDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioOurbitDashboardComponent]
    });
    fixture = TestBed.createComponent(PortfolioOurbitDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
