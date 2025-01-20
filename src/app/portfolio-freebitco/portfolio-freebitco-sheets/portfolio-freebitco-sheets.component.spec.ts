import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioFreebitcoSheetsComponent } from './portfolio-freebitco-sheets.component';

describe('PortfolioFreebitcoSheetsComponent', () => {
  let component: PortfolioFreebitcoSheetsComponent;
  let fixture: ComponentFixture<PortfolioFreebitcoSheetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioFreebitcoSheetsComponent]
    });
    fixture = TestBed.createComponent(PortfolioFreebitcoSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
