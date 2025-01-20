import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuturesClosedPnlComponent } from './futures-closed-pnl.component';

describe('FuturesClosedPnlComponent', () => {
  let component: FuturesClosedPnlComponent;
  let fixture: ComponentFixture<FuturesClosedPnlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FuturesClosedPnlComponent]
    });
    fixture = TestBed.createComponent(FuturesClosedPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
