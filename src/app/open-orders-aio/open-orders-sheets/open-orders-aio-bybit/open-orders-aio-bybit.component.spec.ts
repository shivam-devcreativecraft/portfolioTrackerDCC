import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOrdersAioBybitComponent } from './open-orders-aio-bybit.component';

describe('OpenOrdersAioBybitComponent', () => {
  let component: OpenOrdersAioBybitComponent;
  let fixture: ComponentFixture<OpenOrdersAioBybitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenOrdersAioBybitComponent]
    });
    fixture = TestBed.createComponent(OpenOrdersAioBybitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
