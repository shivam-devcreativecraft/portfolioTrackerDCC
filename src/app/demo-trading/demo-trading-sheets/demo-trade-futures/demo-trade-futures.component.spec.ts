import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTradeFuturesComponent } from './demo-trade-futures.component';

describe('DemoTradeFuturesComponent', () => {
  let component: DemoTradeFuturesComponent;
  let fixture: ComponentFixture<DemoTradeFuturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemoTradeFuturesComponent]
    });
    fixture = TestBed.createComponent(DemoTradeFuturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
