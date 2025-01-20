import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceFunbuyingForFreebitcoComponent } from './binance-funbuying-for-freebitco.component';

describe('BinanceBinanceFunbuyingForFreebitcoComponent', () => {
  let component: BinanceFunbuyingForFreebitcoComponent;
  let fixture: ComponentFixture<BinanceFunbuyingForFreebitcoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BinanceFunbuyingForFreebitcoComponent]
    });
    fixture = TestBed.createComponent(BinanceFunbuyingForFreebitcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
