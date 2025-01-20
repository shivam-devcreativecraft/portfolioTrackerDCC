import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioExnessSheetsComponent } from './portfolio-exness-sheets.component';

describe('PortfolioExnessSheetsComponent', () => {
  let component: PortfolioExnessSheetsComponent;
  let fixture: ComponentFixture<PortfolioExnessSheetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioExnessSheetsComponent]
    });
    fixture = TestBed.createComponent(PortfolioExnessSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
