import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceFuturesTradeComponent } from './binance-futures-trade.component';

describe('BinanceFuturesTradeComponent', () => {
  let component: BinanceFuturesTradeComponent;
  let fixture: ComponentFixture<BinanceFuturesTradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BinanceFuturesTradeComponent]
    });
    fixture = TestBed.createComponent(BinanceFuturesTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
