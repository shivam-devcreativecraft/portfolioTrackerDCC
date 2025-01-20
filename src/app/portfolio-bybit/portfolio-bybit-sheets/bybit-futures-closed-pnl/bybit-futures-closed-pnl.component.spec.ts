import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BybitFuturesClosedPnlComponent } from './bybit-futures-closed-pnl.component';

describe('BybitFuturesClosedPnlComponent', () => {
  let component: BybitFuturesClosedPnlComponent;
  let fixture: ComponentFixture<BybitFuturesClosedPnlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BybitFuturesClosedPnlComponent]
    });
    fixture = TestBed.createComponent(BybitFuturesClosedPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
