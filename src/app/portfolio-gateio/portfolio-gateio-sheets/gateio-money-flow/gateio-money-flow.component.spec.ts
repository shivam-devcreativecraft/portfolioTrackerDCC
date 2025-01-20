import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateioMoneyFlowComponent } from './gateio-money-flow.component';

describe('GateioMoneyFlowComponent', () => {
  let component: GateioMoneyFlowComponent;
  let fixture: ComponentFixture<GateioMoneyFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GateioMoneyFlowComponent]
    });
    fixture = TestBed.createComponent(GateioMoneyFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
