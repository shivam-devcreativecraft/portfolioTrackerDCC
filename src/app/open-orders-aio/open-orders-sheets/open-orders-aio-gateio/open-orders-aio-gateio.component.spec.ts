import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOrdersAioGateioComponent } from './open-orders-aio-gateio.component';

describe('OpenOrdersAioGateioComponent', () => {
  let component: OpenOrdersAioGateioComponent;
  let fixture: ComponentFixture<OpenOrdersAioGateioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenOrdersAioGateioComponent]
    });
    fixture = TestBed.createComponent(OpenOrdersAioGateioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
