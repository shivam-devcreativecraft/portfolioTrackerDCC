import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KucoinFuturesComponent } from './kucoin-futures.component';

describe('KucoinFuturesComponent', () => {
  let component: KucoinFuturesComponent;
  let fixture: ComponentFixture<KucoinFuturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KucoinFuturesComponent]
    });
    fixture = TestBed.createComponent(KucoinFuturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
