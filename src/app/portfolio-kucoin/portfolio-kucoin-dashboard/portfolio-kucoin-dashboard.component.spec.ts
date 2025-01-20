import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioKucoinDashboardComponent } from './portfolio-kucoin-dashboard.component';

describe('PortfolioKucoinDashboardComponent', () => {
  let component: PortfolioKucoinDashboardComponent;
  let fixture: ComponentFixture<PortfolioKucoinDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioKucoinDashboardComponent]
    });
    fixture = TestBed.createComponent(PortfolioKucoinDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
