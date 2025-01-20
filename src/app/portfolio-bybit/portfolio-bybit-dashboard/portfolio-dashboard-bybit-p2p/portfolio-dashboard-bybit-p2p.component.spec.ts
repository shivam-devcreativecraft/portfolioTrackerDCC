import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardBybitP2pComponent } from './portfolio-dashboard-bybit-p2p.component';

describe('PortfolioDashboardBybitP2pComponent', () => {
  let component: PortfolioDashboardBybitP2pComponent;
  let fixture: ComponentFixture<PortfolioDashboardBybitP2pComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardBybitP2pComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardBybitP2pComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
