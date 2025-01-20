import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateioFuturesComponent } from './gateio-futures.component';

describe('GateioFuturesComponent', () => {
  let component: GateioFuturesComponent;
  let fixture: ComponentFixture<GateioFuturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GateioFuturesComponent]
    });
    fixture = TestBed.createComponent(GateioFuturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
