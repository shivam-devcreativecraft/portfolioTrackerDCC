import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeSetupComponent } from './trade-setup.component';

describe('TradeSetupComponent', () => {
  let component: TradeSetupComponent;
  let fixture: ComponentFixture<TradeSetupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradeSetupComponent]
    });
    fixture = TestBed.createComponent(TradeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
