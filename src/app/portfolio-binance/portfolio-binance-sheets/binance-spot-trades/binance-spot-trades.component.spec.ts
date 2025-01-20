import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotTradesComponent } from './binance-spot-trades.component';

describe('SpotTradesComponent', () => {
  let component: SpotTradesComponent;
  let fixture: ComponentFixture<SpotTradesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpotTradesComponent]
    });
    fixture = TestBed.createComponent(SpotTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
