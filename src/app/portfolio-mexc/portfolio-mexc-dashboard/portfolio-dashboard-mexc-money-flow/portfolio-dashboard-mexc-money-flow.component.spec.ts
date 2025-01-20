import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardMexcMoneyFlowComponent } from './portfolio-dashboard-mexc-money-flow.component';

describe('PortfolioDashboardMexcMoneyFlowComponent', () => {
  let component: PortfolioDashboardMexcMoneyFlowComponent;
  let fixture: ComponentFixture<PortfolioDashboardMexcMoneyFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardMexcMoneyFlowComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardMexcMoneyFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
