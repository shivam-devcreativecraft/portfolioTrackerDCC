import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioBybitSheetsComponent } from './portfolio-bybit-sheets.component';

describe('PortfolioBybitSheetsComponent', () => {
  let component: PortfolioBybitSheetsComponent;
  let fixture: ComponentFixture<PortfolioBybitSheetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioBybitSheetsComponent]
    });
    fixture = TestBed.createComponent(PortfolioBybitSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
