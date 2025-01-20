import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBinanceSipComponent } from './portfolio-dashboard-binance-sip.component';

describe('PortfolioDashboardBinanceSipComponent', () => {
  let component: PortfolioDashboardBinanceSipComponent;
  let fixture: ComponentFixture<PortfolioDashboardBinanceSipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBinanceSipComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBinanceSipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
