import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BybitSpotTradesComponent } from './bybit-spot-trades.component';

describe('BybitSpotTradesComponent', () => {
  let component: BybitSpotTradesComponent;
  let fixture: ComponentFixture<BybitSpotTradesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BybitSpotTradesComponent]
    });
    fixture = TestBed.createComponent(BybitSpotTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
