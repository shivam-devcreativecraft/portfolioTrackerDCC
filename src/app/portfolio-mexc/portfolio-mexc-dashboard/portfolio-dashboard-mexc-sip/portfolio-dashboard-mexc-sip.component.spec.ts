import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardMexcSipComponent } from './portfolio-dashboard-mexc-sip.component';

describe('PortfolioDashboardMexcSipComponent', () => {
  let component: PortfolioDashboardMexcSipComponent;
  let fixture: ComponentFixture<PortfolioDashboardMexcSipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardMexcSipComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardMexcSipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
