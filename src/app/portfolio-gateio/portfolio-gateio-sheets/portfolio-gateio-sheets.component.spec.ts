import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioGateioSheetsComponent } from './portfolio-gateio-sheets.component';

describe('PortfolioGateioSheetsComponent', () => {
  let component: PortfolioGateioSheetsComponent;
  let fixture: ComponentFixture<PortfolioGateioSheetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioGateioSheetsComponent]
    });
    fixture = TestBed.createComponent(PortfolioGateioSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
