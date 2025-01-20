import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBybitMoneyFlowComponent } from './portfolio-dashboard-bybit-money-flow.component';

describe('PortfolioDashboardBybitMoneyFlowComponent', () => {
  let component: PortfolioDashboardBybitMoneyFlowComponent;
  let fixture: ComponentFixture<PortfolioDashboardBybitMoneyFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBybitMoneyFlowComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBybitMoneyFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
