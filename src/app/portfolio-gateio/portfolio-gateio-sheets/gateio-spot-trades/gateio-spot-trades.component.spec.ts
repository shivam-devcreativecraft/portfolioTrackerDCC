import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateioSpotTradesComponent } from './gateio-spot-trades.component';

describe('GateioSpotTradesComponent', () => {
  let component: GateioSpotTradesComponent;
  let fixture: ComponentFixture<GateioSpotTradesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GateioSpotTradesComponent]
    });
    fixture = TestBed.createComponent(GateioSpotTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
