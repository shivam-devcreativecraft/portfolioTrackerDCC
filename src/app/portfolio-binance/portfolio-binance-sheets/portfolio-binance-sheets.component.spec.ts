import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioBinanceSheetsComponent } from './portfolio-binance-sheets.component';

describe('PortfolioBinanceSheetsComponent', () => {
  let component: PortfolioBinanceSheetsComponent;
  let fixture: ComponentFixture<PortfolioBinanceSheetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioBinanceSheetsComponent]
    });
    fixture = TestBed.createComponent(PortfolioBinanceSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
