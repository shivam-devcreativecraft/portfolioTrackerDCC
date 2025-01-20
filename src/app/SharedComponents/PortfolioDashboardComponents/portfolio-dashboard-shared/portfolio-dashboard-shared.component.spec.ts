import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboardSharedComponent } from './portfolio-dashboard-shared.component';

describe('PortfolioDashboardSharedComponent', () => {
  let component: PortfolioDashboardSharedComponent;
  let fixture: ComponentFixture<PortfolioDashboardSharedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDashboardSharedComponent]
    });
    fixture = TestBed.createComponent(PortfolioDashboardSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
