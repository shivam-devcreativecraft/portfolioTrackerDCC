import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTradingDashboardComponent } from './demo-trading-dashboard.component';

describe('DemoTradingDashboardComponent', () => {
  let component: DemoTradingDashboardComponent;
  let fixture: ComponentFixture<DemoTradingDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemoTradingDashboardComponent]
    });
    fixture = TestBed.createComponent(DemoTradingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
