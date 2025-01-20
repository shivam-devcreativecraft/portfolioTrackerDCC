import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioMexcSheetsComponent } from './portfolio-mexc-sheets.component';

describe('PortfolioMexcSheetsComponent', () => {
  let component: PortfolioMexcSheetsComponent;
  let fixture: ComponentFixture<PortfolioMexcSheetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioMexcSheetsComponent]
    });
    fixture = TestBed.createComponent(PortfolioMexcSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
