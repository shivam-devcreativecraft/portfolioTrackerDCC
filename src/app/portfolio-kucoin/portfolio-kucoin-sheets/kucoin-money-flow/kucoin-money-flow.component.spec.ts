import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KucoinMoneyFlowComponent } from './kucoin-money-flow.component';

describe('KucoinMoneyFlowComponent', () => {
  let component: KucoinMoneyFlowComponent;
  let fixture: ComponentFixture<KucoinMoneyFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KucoinMoneyFlowComponent]
    });
    fixture = TestBed.createComponent(KucoinMoneyFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
