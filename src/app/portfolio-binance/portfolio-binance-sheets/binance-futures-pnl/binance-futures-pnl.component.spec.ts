import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceFuturesPNLComponent } from './binance-futures-pnl.component';

describe('BinanceFuturePNLComponent', () => {
  let component: BinanceFuturesPNLComponent;
  let fixture: ComponentFixture<BinanceFuturesPNLComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BinanceFuturesPNLComponent]
    });
    fixture = TestBed.createComponent(BinanceFuturesPNLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
