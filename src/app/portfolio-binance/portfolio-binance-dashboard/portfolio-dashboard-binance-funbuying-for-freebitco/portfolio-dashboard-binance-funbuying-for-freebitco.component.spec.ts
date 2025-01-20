import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBinanceFunbuyingForFreebitcoComponent } from './portfolio-dashboard-binance-funbuying-for-freebitco.component';

describe('PortfolioDashboardBinanceFunbuyingForFreebitcoComponent', () => {
  let component: PortfolioDashboardBinanceFunbuyingForFreebitcoComponent;
  let fixture: ComponentFixture<PortfolioDashboardBinanceFunbuyingForFreebitcoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBinanceFunbuyingForFreebitcoComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBinanceFunbuyingForFreebitcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
