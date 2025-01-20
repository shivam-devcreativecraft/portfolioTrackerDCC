import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioBinanceDashboardComponent } from './portfolio-binance-dashboard.component';

describe('PortfolioBinanceDashboardComponent', () => {
  let component: PortfolioBinanceDashboardComponent;
  let fixture: ComponentFixture<PortfolioBinanceDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioBinanceDashboardComponent]
    });
    fixture = TestBed.createComponent(PortfolioBinanceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
