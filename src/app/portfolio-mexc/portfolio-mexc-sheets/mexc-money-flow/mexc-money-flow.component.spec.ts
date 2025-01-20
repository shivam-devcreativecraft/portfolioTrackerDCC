import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MexcMoneyFlowComponent } from './mexc-money-flow.component';

describe('MexcMoneyFlowComponent', () => {
  let component: MexcMoneyFlowComponent;
  let fixture: ComponentFixture<MexcMoneyFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MexcMoneyFlowComponent]
    });
    fixture = TestBed.createComponent(MexcMoneyFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
