import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTradingSheetsComponent } from './demo-trading-sheets.component';

describe('DemoTradingSheetsComponent', () => {
  let component: DemoTradingSheetsComponent;
  let fixture: ComponentFixture<DemoTradingSheetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemoTradingSheetsComponent]
    });
    fixture = TestBed.createComponent(DemoTradingSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
