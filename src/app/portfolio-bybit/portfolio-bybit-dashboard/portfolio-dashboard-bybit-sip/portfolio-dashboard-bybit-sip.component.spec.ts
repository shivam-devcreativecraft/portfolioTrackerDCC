import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBybitSipComponent } from './portfolio-dashboard-bybit-sip.component';

describe('PortfolioDashboardBybitSipComponent', () => {
  let component: PortfolioDashboardBybitSipComponent;
  let fixture: ComponentFixture<PortfolioDashboardBybitSipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBybitSipComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBybitSipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
