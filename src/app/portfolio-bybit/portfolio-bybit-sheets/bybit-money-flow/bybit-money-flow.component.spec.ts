import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BybitMoneyFlowComponent } from './bybit-money-flow.component';

describe('BybitMoneyFlowComponent', () => {
  let component: BybitMoneyFlowComponent;
  let fixture: ComponentFixture<BybitMoneyFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BybitMoneyFlowComponent]
    });
    fixture = TestBed.createComponent(BybitMoneyFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
