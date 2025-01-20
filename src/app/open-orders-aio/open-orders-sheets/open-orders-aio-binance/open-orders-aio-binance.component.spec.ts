import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOrdersAioBinanceComponent } from './open-orders-aio-binance.component';

describe('OpenOrdersAioBinanceComponent', () => {
  let component: OpenOrdersAioBinanceComponent;
  let fixture: ComponentFixture<OpenOrdersAioBinanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenOrdersAioBinanceComponent]
    });
    fixture = TestBed.createComponent(OpenOrdersAioBinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
