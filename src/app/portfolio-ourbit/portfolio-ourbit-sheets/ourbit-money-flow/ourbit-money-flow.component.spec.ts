import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurbitMoneyFlowComponent } from './ourbit-money-flow.component';

describe('OurbitMoneyFlowComponent', () => {
  let component: OurbitMoneyFlowComponent;
  let fixture: ComponentFixture<OurbitMoneyFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurbitMoneyFlowComponent]
    });
    fixture = TestBed.createComponent(OurbitMoneyFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
