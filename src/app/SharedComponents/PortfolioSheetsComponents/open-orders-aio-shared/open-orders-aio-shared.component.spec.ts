import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOrdersAioSharedComponent } from './open-orders-aio-shared.component';

describe('OpenOrdersAioSharedComponent', () => {
  let component: OpenOrdersAioSharedComponent;
  let fixture: ComponentFixture<OpenOrdersAioSharedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenOrdersAioSharedComponent]
    });
    fixture = TestBed.createComponent(OpenOrdersAioSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
