import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceP2pComponent } from './binance-p2p.component';

describe('BinanceP2pComponent', () => {
  let component: BinanceP2pComponent;
  let fixture: ComponentFixture<BinanceP2pComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BinanceP2pComponent]
    });
    fixture = TestBed.createComponent(BinanceP2pComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
