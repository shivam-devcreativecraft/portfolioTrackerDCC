import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceWithdrawCryptoComponent } from './withdraw-crypto.component';

describe('BinanceWithdrawCryptoComponent', () => {
  let component: BinanceWithdrawCryptoComponent;
  let fixture: ComponentFixture<BinanceWithdrawCryptoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BinanceWithdrawCryptoComponent]
    });
    fixture = TestBed.createComponent(BinanceWithdrawCryptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
