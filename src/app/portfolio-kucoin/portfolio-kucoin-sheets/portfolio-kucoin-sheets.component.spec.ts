import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioKucoinSheetsComponent } from './portfolio-kucoin-sheets.component';

describe('PortfolioKucoinSheetsComponent', () => {
  let component: PortfolioKucoinSheetsComponent;
  let fixture: ComponentFixture<PortfolioKucoinSheetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioKucoinSheetsComponent]
    });
    fixture = TestBed.createComponent(PortfolioKucoinSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
