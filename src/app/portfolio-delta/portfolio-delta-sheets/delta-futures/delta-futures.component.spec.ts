import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeltaFuturesComponent } from './delta-futures.component';

describe('DeltaFuturesComponent', () => {
  let component: DeltaFuturesComponent;
  let fixture: ComponentFixture<DeltaFuturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeltaFuturesComponent]
    });
    fixture = TestBed.createComponent(DeltaFuturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
