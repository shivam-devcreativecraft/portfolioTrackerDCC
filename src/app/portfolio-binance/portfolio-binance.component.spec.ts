import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioBinanceComponent } from './portfolio-binance.component';

describe('PortfolioBinanceComponent', () => {
  let component: PortfolioBinanceComponent;
  let fixture: ComponentFixture<PortfolioBinanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioBinanceComponent]
    });
    fixture = TestBed.createComponent(PortfolioBinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
