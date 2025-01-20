import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioMexcDashboardComponent } from './portfolio-mexc-dashboard.component';

describe('PortfolioMexcDashboardComponent', () => {
  let component: PortfolioMexcDashboardComponent;
  let fixture: ComponentFixture<PortfolioMexcDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioMexcDashboardComponent]
    });
    fixture = TestBed.createComponent(PortfolioMexcDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
