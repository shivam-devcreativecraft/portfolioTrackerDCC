import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KucoinSpotTradesComponent } from './kucoin-spot-trades.component';

describe('KucoinSpotTradesComponent', () => {
  let component: KucoinSpotTradesComponent;
  let fixture: ComponentFixture<KucoinSpotTradesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KucoinSpotTradesComponent]
    });
    fixture = TestBed.createComponent(KucoinSpotTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
