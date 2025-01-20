import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDeltaSheetsComponent } from './portfolio-delta-sheets.component';

describe('PortfolioDeltaSheetsComponent', () => {
  let component: PortfolioDeltaSheetsComponent;
  let fixture: ComponentFixture<PortfolioDeltaSheetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDeltaSheetsComponent]
    });
    fixture = TestBed.createComponent(PortfolioDeltaSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
