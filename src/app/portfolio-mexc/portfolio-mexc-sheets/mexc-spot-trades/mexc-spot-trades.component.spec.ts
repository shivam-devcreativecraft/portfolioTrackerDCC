import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MexcSpotTradesComponent } from './mexc-spot-trades.component';

describe('MexcSpotTradesComponent', () => {
  let component: MexcSpotTradesComponent;
  let fixture: ComponentFixture<MexcSpotTradesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MexcSpotTradesComponent]
    });
    fixture = TestBed.createComponent(MexcSpotTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
