import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeDetailsModalComponent } from './trade-details-modal.component';

describe('TradeDetailsModalComponent', () => {
  let component: TradeDetailsModalComponent;
  let fixture: ComponentFixture<TradeDetailsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradeDetailsModalComponent]
    });
    fixture = TestBed.createComponent(TradeDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
