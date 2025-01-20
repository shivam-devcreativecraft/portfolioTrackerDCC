import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeltaMoneyFlowComponent } from './delta-money-flow.component';

describe('DeltaMoneyFlowComponent', () => {
  let component: DeltaMoneyFlowComponent;
  let fixture: ComponentFixture<DeltaMoneyFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeltaMoneyFlowComponent]
    });
    fixture = TestBed.createComponent(DeltaMoneyFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
