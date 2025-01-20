import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioGateioComponent } from './portfolio-gateio.component';

describe('PortfolioGateioComponent', () => {
  let component: PortfolioGateioComponent;
  let fixture: ComponentFixture<PortfolioGateioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioGateioComponent]
    });
    fixture = TestBed.createComponent(PortfolioGateioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
