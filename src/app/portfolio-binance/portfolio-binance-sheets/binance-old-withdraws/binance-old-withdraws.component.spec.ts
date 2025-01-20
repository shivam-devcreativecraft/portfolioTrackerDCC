import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceOldWithdrawsComponent } from './binance-old-withdraws.component';

describe('BinanceOldWithdrawsComponent', () => {
  let component: BinanceOldWithdrawsComponent;
  let fixture: ComponentFixture<BinanceOldWithdrawsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BinanceOldWithdrawsComponent]
    });
    fixture = TestBed.createComponent(BinanceOldWithdrawsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
