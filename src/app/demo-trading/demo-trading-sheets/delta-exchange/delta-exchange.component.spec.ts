import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeltaExchangeComponent } from './delta-exchange.component';

describe('DeltaExchangeComponent', () => {
  let component: DeltaExchangeComponent;
  let fixture: ComponentFixture<DeltaExchangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeltaExchangeComponent]
    });
    fixture = TestBed.createComponent(DeltaExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
