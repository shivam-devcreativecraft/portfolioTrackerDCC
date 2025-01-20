import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioExnessDashboardComponent } from './portfolio-exness-dashboard.component';

describe('PortfolioExnessDashboardComponent', () => {
  let component: PortfolioExnessDashboardComponent;
  let fixture: ComponentFixture<PortfolioExnessDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioExnessDashboardComponent]
    });
    fixture = TestBed.createComponent(PortfolioExnessDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
