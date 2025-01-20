import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTradingComponent } from './demo-trading.component';

describe('DemoTradingComponent', () => {
  let component: DemoTradingComponent;
  let fixture: ComponentFixture<DemoTradingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemoTradingComponent]
    });
    fixture = TestBed.createComponent(DemoTradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
