import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreebitcoMoneyFlowComponent } from './freebitco-money-flow.component';

describe('FreebitcoMoneyFlowComponent', () => {
  let component: FreebitcoMoneyFlowComponent;
  let fixture: ComponentFixture<FreebitcoMoneyFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreebitcoMoneyFlowComponent]
    });
    fixture = TestBed.createComponent(FreebitcoMoneyFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
