import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDemoTradingDeltaFuturesComponent } from './add-demo-trading-delta-futures.component';

describe('AddDemoTradingDeltaFuturesComponent', () => {
  let component: AddDemoTradingDeltaFuturesComponent;
  let fixture: ComponentFixture<AddDemoTradingDeltaFuturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDemoTradingDeltaFuturesComponent]
    });
    fixture = TestBed.createComponent(AddDemoTradingDeltaFuturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
