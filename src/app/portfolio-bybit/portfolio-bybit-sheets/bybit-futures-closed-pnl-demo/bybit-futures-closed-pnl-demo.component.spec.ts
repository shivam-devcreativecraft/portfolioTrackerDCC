import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BybitFutureClosedPnlDemoComponent } from './bybit-futures-closed-pnl-demo.component';

describe('BybitFutureClosedPnlDemoComponent', () => {
  let component: BybitFutureClosedPnlDemoComponent;
  let fixture: ComponentFixture<BybitFutureClosedPnlDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BybitFutureClosedPnlDemoComponent]
    });
    fixture = TestBed.createComponent(BybitFutureClosedPnlDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
