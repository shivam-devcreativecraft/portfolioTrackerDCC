import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBybitGoldVipComponent } from './portfolio-dashboard-bybit-gold-vip.component';

describe('PortfolioDashboardBybitGoldVipComponent', () => {
  let component: PortfolioDashboardBybitGoldVipComponent;
  let fixture: ComponentFixture<PortfolioDashboardBybitGoldVipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBybitGoldVipComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBybitGoldVipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
