import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOrdersAioKucoinComponent } from './open-orders-aio-kucoin.component';

describe('OpenOrdersAioKucoinComponent', () => {
  let component: OpenOrdersAioKucoinComponent;
  let fixture: ComponentFixture<OpenOrdersAioKucoinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenOrdersAioKucoinComponent]
    });
    fixture = TestBed.createComponent(OpenOrdersAioKucoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
