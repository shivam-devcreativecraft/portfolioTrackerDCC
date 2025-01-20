import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioOurbitSheetsComponent } from './portfolio-ourbit-sheets.component';

describe('PortfolioOurbitSheetsComponent', () => {
  let component: PortfolioOurbitSheetsComponent;
  let fixture: ComponentFixture<PortfolioOurbitSheetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioOurbitSheetsComponent]
    });
    fixture = TestBed.createComponent(PortfolioOurbitSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
