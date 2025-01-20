import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioGateDashboardComponent } from './portfolio-gateio-dashboard.component';

describe('PortfolioGateDashboardComponent', () => {
  let component: PortfolioGateDashboardComponent;
  let fixture: ComponentFixture<PortfolioGateDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioGateDashboardComponent]
    });
    fixture = TestBed.createComponent(PortfolioGateDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
