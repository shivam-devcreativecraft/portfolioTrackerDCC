import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurbitFuturesTransfersComponent } from './ourbit-futures-transfers.component';

describe('OurbitFuturesTransfersComponent', () => {
  let component: OurbitFuturesTransfersComponent;
  let fixture: ComponentFixture<OurbitFuturesTransfersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurbitFuturesTransfersComponent]
    });
    fixture = TestBed.createComponent(OurbitFuturesTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
