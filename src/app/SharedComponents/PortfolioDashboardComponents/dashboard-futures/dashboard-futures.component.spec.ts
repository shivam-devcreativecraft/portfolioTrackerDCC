import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFuturesComponent } from './dashboard-futures.component';

describe('DashboardFuturesComponent', () => {
  let component: DashboardFuturesComponent;
  let fixture: ComponentFixture<DashboardFuturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardFuturesComponent]
    });
    fixture = TestBed.createComponent(DashboardFuturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
