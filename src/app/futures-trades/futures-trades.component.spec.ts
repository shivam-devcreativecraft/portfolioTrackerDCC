import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuturesTradesComponent } from './futures-trades.component';

describe('FuturesTradesComponent', () => {
  let component: FuturesTradesComponent;
  let fixture: ComponentFixture<FuturesTradesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FuturesTradesComponent]
    });
    fixture = TestBed.createComponent(FuturesTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
