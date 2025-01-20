import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioFreebitcoDashboardComponent } from './portfolio-freebitco-dashboard.component';

describe('PortfolioFreebitcoDashboardComponent', () => {
  let component: PortfolioFreebitcoDashboardComponent;
  let fixture: ComponentFixture<PortfolioFreebitcoDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioFreebitcoDashboardComponent]
    });
    fixture = TestBed.createComponent(PortfolioFreebitcoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
