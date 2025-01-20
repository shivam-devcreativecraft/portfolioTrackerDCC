import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingviewComponent } from './tradingview.component';

describe('TradingviewComponent', () => {
  let component: TradingviewComponent;
  let fixture: ComponentFixture<TradingviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradingviewComponent]
    });
    fixture = TestBed.createComponent(TradingviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
