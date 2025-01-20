import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDeltaDashboardComponent } from './portfolio-delta-dashboard.component';

describe('PortfolioDeltaDashboardComponent', () => {
  let component: PortfolioDeltaDashboardComponent;
  let fixture: ComponentFixture<PortfolioDeltaDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDeltaDashboardComponent]
    });
    fixture = TestBed.createComponent(PortfolioDeltaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
