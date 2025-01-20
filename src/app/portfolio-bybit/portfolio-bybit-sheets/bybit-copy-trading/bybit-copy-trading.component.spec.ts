import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BybitCopyTradingComponent } from './bybit-copy-trading.component';

describe('BybitCopyTradingComponent', () => {
  let component: BybitCopyTradingComponent;
  let fixture: ComponentFixture<BybitCopyTradingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BybitCopyTradingComponent]
    });
    fixture = TestBed.createComponent(BybitCopyTradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
